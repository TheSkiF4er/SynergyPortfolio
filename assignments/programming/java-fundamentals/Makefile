.PHONY: compile test clean
JAVAC ?= javac
JAVA ?= java
BUILD := .build
SOURCES := $(shell find . -type f -name '*.java' -not -path './.build/*')

compile:
	@rm -rf $(BUILD) && mkdir -p $(BUILD)
	@$(JAVAC) -encoding UTF-8 -d $(BUILD) $(SOURCES)
	@echo 'Java Fundamentals: compilation OK'

test: compile
	@$(JAVA) -ea -cp $(BUILD) javafundamentals.tests.CourseTests

clean:
	@rm -rf $(BUILD)
