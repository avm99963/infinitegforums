.PHONY: all chromium-stable chromium-beta gecko-stable gecko-beta clean

all: chromium-stable chromium-beta gecko-stable gecko-beta

chromium-stable:
	bash release.bash -c stable -b chromium

chromium-beta:
	bash release.bash -c beta -b chromium

gecko-stable:
	bash release.bash -c stable -b gecko

gecko-beta:
	bash release.bash -c beta -b gecko

clean:
	rm -rf out
