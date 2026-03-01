package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"regexp"
)

var ifStatementRegexp = regexp.MustCompile(`#!if\s*(.*)$`)
var elseStatementRegexp = regexp.MustCompile(`#!else\s*$`)
var endifStatementRegexp = regexp.MustCompile(`#!endif\s*$`)

type LevelStatus struct {
	// true if the if statement is satisfied.
	Satisfied bool
	// true if currently processing the if branch. false if processing the else branch.
	ProcessingIfBranch bool
	// true if some parent level indicates that this line should not be printed.
	ParentsBlockPrint bool
}

func (levelStatus *LevelStatus) shouldPrint() bool {
	return !levelStatus.ParentsBlockPrint && ((levelStatus.ProcessingIfBranch && levelStatus.Satisfied) || (!levelStatus.ProcessingIfBranch && !levelStatus.Satisfied))
}

type preprocessor struct {
	source              io.Reader
	destination         io.Writer
	definedDependencies []string
	stack               []*LevelStatus
}

func NewPreprocessor(source io.Reader, destination io.Writer, definedDependencies []string) preprocessor {
	return preprocessor{source, destination, definedDependencies, []*LevelStatus{}}
}

func (p *preprocessor) Preprocess() error {
	lineNumber := 0
	scanner := bufio.NewScanner(p.source)
	for scanner.Scan() {
		lineNumber++
		line := scanner.Text()
		shouldPrintLine, err := p.shouldPrintLine(line)
		if err != nil {
			return fmt.Errorf("error while parsing line %d: %v", lineNumber, err)
		}
		if shouldPrintLine {
			_, err := io.WriteString(p.destination, line+"\n")
			if err != nil {
				return fmt.Errorf("can't write to destination file: %v", err)
			}
		}
	}
	if len(p.stack) != 0 {
		return errors.New("file has unmatched statements")
	}
	return nil
}

func (p *preprocessor) shouldPrintLine(line string) (bool, error) {
	if m := ifStatementRegexp.FindStringSubmatch(line); m != nil {
		rawQuery := m[1]
		return p.processIfStatement(rawQuery)
	} else if elseStatementRegexp.MatchString(line) {
		return p.processElseStatement()
	} else if endifStatementRegexp.MatchString(line) {
		return p.processEndifStatement()
	} else {
		return p.processRegularLine()
	}
}

func (p *preprocessor) processIfStatement(rawQuery string) (bool, error) {
	queryParser := NewQueryParser(rawQuery)
	query, err := queryParser.Parse()
	if err != nil {
		return false, err
	}
	p.stack = append(p.stack, &LevelStatus{
		Satisfied:          query.Satisfies(p.definedDependencies),
		ProcessingIfBranch: true,
		ParentsBlockPrint:  len(p.stack) > 0 && !p.stack[len(p.stack)-1].shouldPrint(),
	})
	return false, nil
}

func (p *preprocessor) processElseStatement() (bool, error) {
	if len(p.stack) == 0 {
		return false, errors.New("else statement appears without an if statement first")
	}
	lastLevelStatus := p.stack[len(p.stack)-1]
	if !lastLevelStatus.ProcessingIfBranch {
		return false, errors.New("else statement appears a second time in a row")
	}
	lastLevelStatus.ProcessingIfBranch = false
	return false, nil
}

func (p *preprocessor) processEndifStatement() (bool, error) {
	if len(p.stack) == 0 {
		return false, errors.New("endif statement doesn't have a matching if statement")
	}
	p.stack = p.stack[0 : len(p.stack)-1]
	return false, nil
}

func (p *preprocessor) processRegularLine() (bool, error) {
	if len(p.stack) == 0 {
		return true, nil
	}
	lastLevelStatus := p.stack[len(p.stack)-1]
	shouldPrintLine := lastLevelStatus.shouldPrint()
	return shouldPrintLine, nil
}
