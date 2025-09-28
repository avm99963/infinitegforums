package main

import (
	"slices"
)

type Satisfiable interface {
	Satisfies(definedDependencies []string) bool
}

type BinomialStatement struct {
	First  Satisfiable
	Second Satisfiable
	// If true, both parts are joined by an and. Otherwise, by an or.
	IsAnd bool
}

func (q BinomialStatement) Satisfies(definedDependencies []string) bool {
	if q.IsAnd {
		return q.First.Satisfies(definedDependencies) && q.Second.Satisfies(definedDependencies)
	} else {
		return q.First.Satisfies(definedDependencies) || q.Second.Satisfies(definedDependencies)
	}
}

type NegateStatement struct {
	Statement Satisfiable
}

func (s NegateStatement) Satisfies(definedDependencies []string) bool {
	return !s.Statement.Satisfies(definedDependencies)
}

type DefinedStatement struct {
	Dependency string
}

func (s DefinedStatement) Satisfies(definedDependencies []string) bool {
	return slices.Contains(definedDependencies, s.Dependency)
}

type AlwaysStatisfiable struct{}

func (_ AlwaysStatisfiable) Satisfies(_ []string) bool {
	return true
}
