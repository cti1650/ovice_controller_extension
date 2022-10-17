;((global) => {
    if (global.oviceConnecterTick) {
        clearInterval(global.oviceConnecterTick)
    }
    let old_ovice_data = {}
    global.oviceConnecterTick = setInterval(() => {
        const ovice = oviceConnecter()
        if (
            Object.keys(ovice).filter((key) => {
                return (
                    typeof ovice[key] !== 'function' &&
                    old_ovice_data[key] !== ovice[key]
                )
            }).length
        ) {
            // console.log('oviceStatus', ovice)
            chrome.runtime.sendMessage('get_ovice_status', () => {})
        }
        old_ovice_data = ovice
    }, 300)
})(window)
