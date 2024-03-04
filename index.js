const fs = require('fs');

// ファイルからログを読み込んで、ユーザーごとにスコアを集計する関数
function processLogs(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').trim().split('\n');

    const userScores = {};
    const userCounts = {};

    for (const line of data) {
        const [timestamp, userID, score] = line.split(',');
        if (!userScores[userID]) {
            userScores[userID] = 0;
            userCounts[userID] = 0;
        }
        userScores[userID] += parseInt(score);
        userCounts[userID]++;
    }

    const averages = [];
    for (const userID in userScores) {
        const average = userScores[userID] / userCounts[userID];
        averages.push({ userID, average });
    }

    return averages;
}

// 平均スコアの降順でソートする関数
function sortAverages(averages) {
    return averages.sort((a, b) => b.average - a.average);
}

// 結果を出力する関数
function outputResults(sortedAverages) {
    const results = sortedAverages.slice(0, 10);
    results.forEach((result, index) => {
        console.log(`${index + 1},${result.userID},${Math.round(result.average)}`);
    });
}

// メイン関数
function main() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Usage: node program.js <csvFilePath>');
        process.exit(1);
    }

    const filePath = args[0];
    if (!fs.existsSync(filePath)) {
        console.error('File not found.');
        process.exit(1);
    }

    const averages = processLogs(filePath);
    const sortedAverages = sortAverages(averages);
    outputResults(sortedAverages);
}

// プログラムの実行
main();
