all: mqtt-to-timescale

mqtt-to-timescale: index.es5.js
	npx pkg -t node17-linux-x64 -o mqtt-to-timescale index.es5.js
	rm -f index.es5.js

index.es5.js: index.js
	npx babel --presets @babel/env index.js > index.es5.js

clean:
	rm -f index.es5.js mqtt-to-timescale
