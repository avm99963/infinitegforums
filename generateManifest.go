package main

import (
  "bufio"
  "flag"
  "fmt"
  "io"
  "log"
  "os"
  "regexp"
  "strings"
)

// Generates the manifest.json file according to the dependencies passed
// via CLI arguments

const (
  manifestTemplate = "templates/manifest.gjson"
  manifestSrc = "src/manifest.json"
)

var beginningOfIfStatement = regexp.MustCompile(`^\s*#if defined\(([^\(\)]*)\)\s*$`)
var endOfIfStatement = regexp.MustCompile(`^\s*#endif\s*$`)

var (
  quietMode = flag.Bool("quiet", false, "Quiet mode")
)

func FindWithCaseFolding(slice []string, val string) bool {
  for _, item := range slice {
    if strings.EqualFold(item, val) {
      return true
    }
  }
  return false
}

func WriteManifest(template io.Reader, dest io.Writer, dependencies []string) error {
  level := 0
  activeLevel := 0
  scanner := bufio.NewScanner(template)
  for scanner.Scan() {
    line := scanner.Text()
    considerLine := false
    if m := beginningOfIfStatement.FindStringSubmatch(line); m != nil {
      if level == activeLevel {
        statementDeps := m[1]
        deps := strings.Split(statementDeps, "||")
        for _, dep := range deps {
          dep = strings.TrimSpace(dep)
          if FindWithCaseFolding(dependencies, dep) {
            activeLevel++
            break
          }
        }
      }
      level++
    } else if m := endOfIfStatement.MatchString(line); m {
      if activeLevel == level {
        activeLevel--
      }
      level--
    } else {
      considerLine = level == activeLevel
    }

    if considerLine {
      _, err := io.WriteString(dest, line + "\n")
      if err != nil {
        return fmt.Errorf("Can't write manifest: %v", err)
      }
    }
  }

  return nil
}

func main() {
  log.SetPrefix("generateManifest: ")
  log.SetFlags(0)

  flag.Parse()
  dependencies := flag.Args()

  if len(dependencies) == 0 {
    log.Fatalf("Pass the dependencies as arguments (for instance, run `go run generateManifest.go CHROMIUM`).")
  }

  template, err := os.Open(manifestTemplate)
  if err != nil {
    log.Fatalf("Couldn't open file %v: %v", manifestTemplate, err)
  }
  defer template.Close()

  dest, err := os.Create(manifestSrc)
  if err != nil {
    log.Fatalf("Couldn't create file %v: %v", manifestSrc, err)
  }
  defer dest.Close()

  err = WriteManifest(template, dest, dependencies)
  if err != nil {
    log.Fatalf("%v", err)
  } else if !*quietMode {
    log.Println("Manifest has been generated successfully")
  }
}
