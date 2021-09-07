const ora = require('ora')
const Inquirer = require('inquirer')
const promisify = require('util').promisify
const fs = require('fs')
const statFn = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)

const waitFnLoading = (fn, massage) => async (...args) => {
    const spinner = ora(massage)
    spinner.start()
    const data = await fn(...args)
    spinner.succeed()
    return data
}

const transformFile = async (path, multiple) => {
    try {
        const stat = await statFn(path)
        if (stat.isDirectory()) {
            console.log('请输入正确的文件路径')
        } else if (stat.isFile()) {
            const regpx = /\d+rpx/g;
            const file = fs.readFileSync(path);
            let fileString = file.toString();
            // 匹配到的数组
            const matchArr = fileString.match(regpx);
            // 分割后的数组
            const reTextArr = fileString.split(regpx);
            // 转换后的数组
            const pxArr = [];
            // 新的内容
            let newString = '';
            if (matchArr) {
                // rpx 转 px
                matchArr.forEach((itemString) => {
                    let num = Number(itemString.replace('rpx', ''));
                    pxArr.push(num / multiple + 'px');
                });
            } else {
                return 
            }
            // 推到newString中
            reTextArr.forEach((reItem, index) => {
                newString += reItem;
                pxArr[index] && (newString += pxArr[index]);
            });
            try {
                await writeFile(path, newString);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = async (projectPath) => {
    // 选择模板 inquiere
    const { multiple } = await Inquirer.prompt({
        name: 'multiple',
        type: 'input',
        message: '请输入转换倍数',
        default: 2
    })
    waitFnLoading(transformFile, '单位转换')(projectPath, multiple)
}