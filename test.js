
    (async function () {
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        for (let j = 0; j < 10; j++) {
            if (j % 3 == 0) {
                await sleep(5000)
            } else {
                console.log(j);
            }

        }
    })()





