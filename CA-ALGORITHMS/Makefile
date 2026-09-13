.PHONY: clean compile test
BUILD=.build
SOURCES=$(shell find . -name '*.java' -type f)
compile:
	@rm -rf $(BUILD) && mkdir -p $(BUILD)
	@javac -encoding UTF-8 -d $(BUILD) $(SOURCES)
	@echo "Java compile: OK"
test: compile
	@java -cp $(BUILD) AlgorithmsTest
clean:
	@rm -rf $(BUILD)
