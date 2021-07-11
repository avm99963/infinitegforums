package main

import (
  "bytes"
  "crypto/sha256"
  "encoding/hex"
  "io"
  "os"
  "testing"
)

type Manifest struct {
  name string
  templateFile string
  expectedFile string
  dependencies []string
}

func TestManifestConversions(t *testing.T) {
  testManifests := []Manifest{
    {
      name: "ManifestSmall",
      templateFile: "testdata/manifest_small1.gjson",
      expectedFile: "testdata/manifest_small1_expected.json",
      dependencies: []string{"AAA", "BBB", "D"},
    },
    {
      name: "ManifestFrozenChromium",
      templateFile: "testdata/manifest_frozen.gjson",
      expectedFile: "testdata/manifest_frozen_chromium_expected.json",
      dependencies: []string{"CHROMIUM"},
    },
    {
      name: "ManifestFrozenGecko",
      templateFile: "testdata/manifest_frozen.gjson",
      expectedFile: "testdata/manifest_frozen_gecko_expected.json",
      dependencies: []string{"GECKO"},
    },
  }

  for _, m := range testManifests {
    t.Run(m.name, func(t *testing.T) {
      template, err := os.Open(m.templateFile)
      if err != nil {
        t.Fatalf("Can't open test file: %v", err)
      }
      defer template.Close()

      expected, err := os.Open(m.expectedFile)
      if err != nil {
        t.Fatalf("Can't open expected file: %v", err)
      }
      defer expected.Close()

      dest := bytes.NewBufferString("")

      WriteManifest(template, dest, m.dependencies)
      if err != nil {
        t.Fatal(err)
      }

      h1 := sha256.New()
      if _, err := io.Copy(h1, dest); err != nil {
        t.Fatalf("Can't prepare sha256 sum of the result: %v", err)
      }

      h2 := sha256.New()
      if _, err := io.Copy(h2, expected); err != nil {
        t.Fatalf("Can't prepare sha256 sum of the expected file: %v", err)
      }

      sum1 := h1.Sum(nil)
      sum2 := h2.Sum(nil)
      if bytes.Compare(sum1, sum2) != 0 {
        t.Fatalf("The expected manifest file (sha256: %v) differs from what we got (sha256: %v).", hex.EncodeToString(sum2), hex.EncodeToString(sum1))
      }
    })
  }
}
