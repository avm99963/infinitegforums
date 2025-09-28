package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"os"
	"testing"
)

// TODO: All the error handling paths are not being tested. Test them.

type TestSuite struct {
	name           string
	testDataFolder string
}

func TestPreprocessor(t *testing.T) {
	testSuites := []TestSuite{
		{
			name:           "NoPreprocessorRules",
			testDataFolder: "no_preprocessor_rules",
		},
		{
			name:           "EmptyParentheses",
			testDataFolder: "empty_parentheses",
		},
		{
			name:           "If",
			testDataFolder: "if",
		},
		{
			name:           "IfElse",
			testDataFolder: "if_else",
		},
		{
			name:           "And",
			testDataFolder: "and",
		},
		{
			name:           "Or",
			testDataFolder: "or",
		},
		{
			name:           "NotDefined",
			testDataFolder: "not_defined",
		},
		{
			name:           "NotParenthesis",
			testDataFolder: "not_parenthesis",
		},
		{
			name:           "Complex",
			testDataFolder: "complex",
		},
	}

	definedDependencies := []string{"foo_is_awesome"}

	for _, test := range testSuites {
		t.Run(test.name, func(t *testing.T) {
			source, err := os.Open("test_data/" + test.testDataFolder + "/source.txt")
			if err != nil {
				t.Fatalf("Can't open source file for test: %v", err)
			}
			defer source.Close()

			expected, err := os.Open("test_data/" + test.testDataFolder + "/expected.txt")
			if err != nil {
				t.Fatalf("Can't open expected file for test: %v", err)
			}
			defer expected.Close()

			destination := bytes.NewBufferString("")

			preprocessor := NewPreprocessor(source, destination, definedDependencies)
			err = preprocessor.Preprocess()
			if err != nil {
				t.Fatal(err)
			}
			h1 := sha256.New()
			if _, err := io.Copy(h1, destination); err != nil {
				t.Fatalf("Can't prepare sha256 sum of the result: %v", err)
			}
			h2 := sha256.New()
			if _, err := io.Copy(h2, expected); err != nil {
				t.Fatalf("Can't prepare sha256 sum of the expected file: %v", err)
			}
			sum1 := h1.Sum(nil)
			sum2 := h2.Sum(nil)
			if !bytes.Equal(sum1, sum2) {
				t.Fatalf("The expected preprocessed file (sha256: %v) differs from what we got (sha256: %v).", hex.EncodeToString(sum2), hex.EncodeToString(sum1))
			}
		})
	}
}
