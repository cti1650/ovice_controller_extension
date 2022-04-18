import { keyList, TabState } from '@components/Recoil'

// oViceのタブ情報の変更を確認するための関数
export const getStorageData = async (tabState: TabState) => {
    let updateData = {}
    if (chrome.storage) {
        // Chrome拡張機能のAction Pageで実行する場合
        await new Promise((resolve, reject) => {
            chrome.storage?.local.get(
                [...Object.keys(keyList).map((key) => keyList[key])],
                (data) => {
                    // Chrome Storageから取得失敗した場合はエラーを返す
                    if (chrome.runtime.lastError) {
                        console.error(
                            'getStorageData error:',
                            chrome.runtime.lastError.message
                        )
                        return reject(chrome.runtime.lastError.message)
                    }

                    // Chrome Storageから取得したデータを更新する
                    Object.keys(tabState)
                        .filter((key) => {
                            return (
                                key !== '' &&
                                tabState[key] !== data[keyList[key]]
                            )
                        })
                        .forEach((key) => {
                            updateData[key] = data[keyList[key]]
                        })
                    resolve(updateData)
                }
            )
        })
    } else {
        // ローカル環境で実行する場合
        Object.keys(tabState).forEach((key) => {
            switch (key) {
                case '':
                    break
                case 'tabId':
                    // ローカルストレージに格納した値が数値の場合の更新処理
                    if (
                        tabState[key] !==
                        Number(localStorage.getItem(keyList[key]))
                    ) {
                        updateData = {
                            ...updateData,
                            [key]:
                                Number(localStorage.getItem(keyList[key])) || 0,
                        }
                    }
                    break
                case 'tabTitle':
                case 'place':
                case 'placeType':
                    // ローカルストレージに格納した値が文字列の場合の更新処理
                    if (tabState[key] !== localStorage.getItem(keyList[key])) {
                        updateData = {
                            ...updateData,
                            [key]: localStorage.getItem(keyList[key]),
                        }
                    }
                    break
                default:
                    // ローカルストレージに格納した値が真偽値の場合の更新処理
                    if (
                        tabState[key] !== !!localStorage.getItem(keyList[key])
                    ) {
                        updateData = {
                            ...updateData,
                            [key]: !!localStorage.getItem(keyList[key]),
                        }
                    }
                    break
            }
        })
    }
    // 更新データがあれば更新した要素のみオブジェクトを返す
    if (Object.keys(updateData).length > 0) {
        return updateData
    } else {
        return null
    }
}
