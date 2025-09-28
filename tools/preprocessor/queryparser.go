package main

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

type queryParser struct {
	rawQuery string
	queryIdx int
}

func NewQueryParser(rawQuery string) queryParser {
	return queryParser{rawQuery, 0}
}

func (p *queryParser) Parse() (Satisfiable, error) {
	p.queryIdx = 0
	queryLevelParser := newQueryLevelParser(p, true)
	return queryLevelParser.parse()
}

type queryLevelParser struct {
	parentParser *queryParser
	topStatement Satisfiable
	// Whether it is the root level (there are no levels above).
	isRoot bool
	// true if the next atom to parse is a "defined" statement or a group of
	// statements. false if it should be an operator.
	shouldFollowWithStatement bool
	// whether an operator has appeared in the current level and thus we should
	// start composing a binomial.
	isReadyForBinomial bool
	// whether the level operator is an and
	isAndOperator bool
}

func newQueryLevelParser(parentParser *queryParser, isRoot bool) queryLevelParser {
	// By default, if the query is empty, we will always satisfy it.
	topStatement := AlwaysStatisfiable{}
	return queryLevelParser{
		parentParser:              parentParser,
		topStatement:              topStatement,
		isRoot:                    isRoot,
		shouldFollowWithStatement: true,
		isReadyForBinomial:        false,
		isAndOperator:             false,
	}
}

func (p *queryLevelParser) parse() (Satisfiable, error) {
	for p.parentParser.queryIdx < len(p.parentParser.rawQuery) {
		if p.hasNextSubstringAndAdvanceIfSo(" ") {
			// noop
		} else if p.hasNextSubstringAndAdvanceIfSo("(") {
			err := p.handleOpeningParenthesis(false)
			if err != nil {
				return nil, err
			}
		} else if p.hasNextSubstringAndAdvanceIfSo("!(") {
			err := p.handleOpeningParenthesis(true)
			if err != nil {
				return nil, err
			}
		} else if p.hasNextSubstringAndAdvanceIfSo(")") {
			if !p.isRoot {
				return p.topStatement, nil
			} else {
				return nil, errors.New("there is a mismatched closing parenthesis")
			}
		} else if p.hasNextSubstringAndAdvanceIfSo("&&") {
			err := p.handleOperator("&&", true)
			if err != nil {
				return nil, err
			}
		} else if p.hasNextSubstringAndAdvanceIfSo("||") {
			err := p.handleOperator("||", false)
			if err != nil {
				return nil, err
			}
		} else if dependency, isNegated := p.getDefinedStatementAndAdvanceIfSo(); dependency != "" {
			err := p.handleDefinedStatement(dependency, isNegated)
			if err != nil {
				return nil, err
			}
		} else {
			return nil, fmt.Errorf("character %c not recognized (at index %d)", p.parentParser.rawQuery[p.parentParser.queryIdx], p.parentParser.queryIdx)
		}
	}
	if !p.isRoot {
		return nil, errors.New("a closing parenthesis is missing")
	} else {
		if p.shouldFollowWithStatement {
			return nil, errors.New("a statement was expected before the end")
		} else {
			return p.topStatement, nil
		}
	}
}

func (p *queryLevelParser) hasNextSubstringAndAdvanceIfSo(substring string) bool {
	queryIdx := p.parentParser.queryIdx
	rawQuery := p.parentParser.rawQuery

	hasEnoughSpaceForSubstring := queryIdx+len(substring)-1 < len(rawQuery)
	result := hasEnoughSpaceForSubstring && rawQuery[queryIdx:(queryIdx+len(substring))] == substring
	if result {
		p.parentParser.queryIdx += len(substring)
	}
	return result
}

var definedStatementRegexp = regexp.MustCompile(`^(!?)defined\(([^\(\)]+)\)`)

func (p *queryLevelParser) getDefinedStatementAndAdvanceIfSo() (dependency string, isNegated bool) {
	m := definedStatementRegexp.FindStringSubmatch(p.parentParser.rawQuery[p.parentParser.queryIdx:])
	if m != nil {
		p.parentParser.queryIdx += len(m[0])
		dependency = strings.TrimSpace(m[2])
		isNegated = m[1] == "!"
	} else {
		dependency = ""
		isNegated = false
	}
	return
}

func (p *queryLevelParser) handleOpeningParenthesis(isNegated bool) error {
	if !p.shouldFollowWithStatement {
		return errors.New("expected an operator, instead there is a (")
	}

	nextLevelStatement, err := p.parseNextLevel()
	if err != nil {
		return err
	}

	if isNegated {
		nextLevelStatement = NegateStatement{nextLevelStatement}
	}
	p.appendStatement(nextLevelStatement)
	p.shouldFollowWithStatement = false

	return nil
}

func (p *queryLevelParser) handleOperator(expression string, isAnd bool) error {
	if p.shouldFollowWithStatement {
		return fmt.Errorf("a '%s' expression cannot be placed next to another operator", expression)
	}
	if !p.isReadyForBinomial {
		p.isAndOperator = isAnd
		p.isReadyForBinomial = true
	} else {
		if (isAnd && !p.isAndOperator) || (!isAnd && p.isAndOperator) {
			return errors.New("'&&' and '||' expressions cannot appear at the same level. please use parentheses to explicitly set the order of operators")
		}
	}
	p.shouldFollowWithStatement = true
	return nil
}

func (p *queryLevelParser) handleDefinedStatement(dependency string, isNegated bool) error {
	if !p.shouldFollowWithStatement {
		return errors.New("expected an operator, instead there is a defined(...) statement")
	}
	var statement Satisfiable
	statement = DefinedStatement{
		Dependency: dependency,
	}
	if isNegated {
		statement = NegateStatement{
			Statement: statement,
		}
	}
	p.appendStatement(statement)
	p.shouldFollowWithStatement = false
	return nil
}

func (p *queryLevelParser) parseNextLevel() (Satisfiable, error) {
	nextLevelParser := newQueryLevelParser(p.parentParser, false)
	return nextLevelParser.parse()
}

func (p *queryLevelParser) appendStatement(statement Satisfiable) {
	if p.isReadyForBinomial {
		p.topStatement = BinomialStatement{
			First:  p.topStatement,
			Second: statement,
			IsAnd:  p.isAndOperator,
		}
	} else {
		p.topStatement = statement
	}
}
