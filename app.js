const FS = require("fs");
const Path = require("path");
const Axios = require("axios");

// https://www.welcometothehouseofgucci.com/static/media/_c2d/webp/0000.webp

const BASE_URL = "https://www.welcometothehouseofgucci.com/static/media/_c2d/webp";
const FILE_SUFFIX = "webp";
const STARTIDX = 0;
const ENDIDX = 1199;

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function download() {
	try {
		// 0000.webp - 1199.webp
		for (let index = STARTIDX; index <= ENDIDX; index++) {
			
            // file names are prefixed with leading "0"s so prefix with zero's. 
			let prefix = "";
			if (index < 10) prefix = "000";
			else if (index < 100) prefix = "00";
			else if (index < 1000) prefix = "0";
			else if (index >= 1000) prefix = "";

			const res = await Axios({
				method: "GET",
				url: `${BASE_URL}/${prefix}${index}.${FILE_SUFFIX}`,
				responseType: "stream",
			});

			const path = Path.resolve(__dirname, "images", `img_${index}.${FILE_SUFFIX}`);
			await res.data.pipe(FS.createWriteStream(path));

			res.data.on("end", () => {
				const percentage = (100 / ENDIDX) * index;
				console.clear();
				console.info(`${prefix}${index}.${FILE_SUFFIX} --> %${percentage.toFixed(1)} Complete ✅`);
			});

			await sleep(100); 
		}
	} catch (error) {
		console.log(`Error URL: ${error.config.url}`);
	}
}

download();
