package main

import (
	"flag"
	"fmt"
	"log"
	"os"
)

var (
	sourceFile      = flag.String("source", "", "Source file to preprocess")
	destinationFile = flag.String("destination", "", "Destination file")
)

func main() {
	log.SetPrefix("preprocessor: ")
	log.SetFlags(0)
	flag.Parse()
	definedDependencies := flag.Args()
	if *sourceFile == "" {
		log.Fatalf("Pass the source file name via the -source flag.")
	}
	if *destinationFile == "" {
		log.Fatalf("Pass the destination file name via the -destination flag.")
	}
	err := preprocess(*sourceFile, *destinationFile, definedDependencies)
	if err != nil {
		log.Fatalf("%v", err)
	}
}

func preprocess(sourceFile string, destinationFile string, definedDependencies []string) error {
	source, err := os.Open(sourceFile)
	if err != nil {
		return fmt.Errorf("Couldn't open file %v: %v", sourceFile, err)
	}
	defer source.Close()
	dest, err := os.Create(destinationFile)
	if err != nil {
		return fmt.Errorf("Couldn't create file %v: %v", destinationFile, err)
	}
	defer dest.Close()
	preprocessor := NewPreprocessor(source, dest, definedDependencies)
	return preprocessor.Preprocess()
}
