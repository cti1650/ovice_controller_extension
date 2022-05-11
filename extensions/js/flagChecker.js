;((global) => {
    const ovice = global.oviceConnecter()
    chrome.storage.local.set({
        ovice_tab_title: ovice?.title,
        ovice_place_type: ovice?.placeType,
        ovice_has_logout: ovice?.hasLogout,
        ovice_has_openspace: ovice?.hasOpenSpace,
        ovice_has_coffee: ovice?.hasCoffee,
        ovice_has_screenshare: ovice?.hasScreenshare,
        ovice_screenshare_on: ovice?.screenshareState,
        ovice_has_mic: ovice?.hasMic,
        ovice_mic_on: ovice?.micState,
    })
})(window)
