import { useCallback, useEffect, useMemo, useState } from "react";

export const useOviceMic = () => {
  const [mic, setMic] = useState(false);
  const close = useCallback(async () => {
    let tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              const ele = document.querySelector("#leave-openspace-block");
              if (ele) {
                ele["click"]();
              }
            },
          },
          () => {
            getMic();
          }
        );
      }
    });
  }, []);
  const active = useCallback(async () => {
    let tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
        chrome.tabs.update(tab.id, { selected: true }, function (tab) {});
      }
    });
  }, []);

  const coffee = useCallback(async () => {
    let tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              const ele = document.querySelector("#away-block");
              if (ele) {
                ele["click"]();
              }
            },
          },
          () => {
            getMic();
          }
        );
      }
    });
  }, []);
  const changeMic = useCallback(
    async (flag: boolean) => {
      let tabs = await chrome.tabs.query({});
      tabs.forEach((tab) => {
        if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
          if (mic !== flag) {
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: () => {
                  const ele = document.querySelector("#mic-block > div");
                  if (ele) {
                    ele["click"]();
                  }
                },
              },
              () => {
                getMic();
              }
            );
          }
        }
      });
    },
    [mic]
  );
  const getMic = useCallback(async () => {
    let tabs = await chrome.tabs.query({});
    tabs.forEach((tab) => {
      if (/https?:\/\/.*?\.ovice\.in/.test(tab.url)) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              const ele = document.querySelector("#mic-block > div");
              console.log(window["ovice"]);
              if (ele.querySelector(".bar-device-off")) {
                console.log("mic off");
                return false;
              }
              if (ele.querySelector(".bar-device-on")) {
                console.log("mic on");
                return true;
              }
              return false;
            },
          },
          (injectionResults) => {
            for (const frameResult of injectionResults) {
              chrome.notifications.create(
                "mic",
                { title: "mic", message: "on", iconUrl: "", type: "basic" },
                () => {}
              );
              setMic(frameResult.result);
            }
          }
        );
      }
    });
  }, []);
  useEffect(() => {
    setMic(false);
    getMic();
  }, []);
  return useMemo(() => {
    return {
      mic,
      close,
      coffee,
      active,
      changeMic,
    };
  }, [mic, changeMic, active, close, coffee, getMic]);
};
