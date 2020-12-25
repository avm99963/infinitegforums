.PHONY: all chromium-stable chromium-beta chromium-mv3-beta gecko-stable clean

all: chromium-stable chromium-beta chromium-mv3-beta gecko-stable

chromium-stable:
	bash release.bash -c stable -b chromium

chromium-beta:
	bash release.bash -c beta -b chromium

chromium-mv3-beta:
	bash release.bash -c beta -b chromium_mv3

gecko-stable:
	bash release.bash -c stable -b gecko

clean:
	rm -rf out
