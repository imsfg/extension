function getDateString(nDate) {
  let nDateDate = nDate.getDate();
  let nDateMonth = nDate.getMonth() + 1;
  let nDateYear = nDate.getFullYear();
  if (nDateDate < 10) {
    nDateDate = "0" + nDateDate;
  }
  if (nDateMonth < 10) {
    nDateMonth = "0" + nDateMonth;
  }
  let presentDate = "" + nDateYear + "-" + nDateMonth + "-" + nDateDate;
  return presentDate;
}


var today1 = getDateString(new Date());
function isValidURL(givenURL){
  if(givenURL){
    if(givenURL.includes(".")){
      return true;
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
}
function secondsToString(seconds,compressed=false){
    let hours = parseInt(seconds/3600);
    seconds = seconds%3600;
    let minutes= parseInt(seconds/60);
    seconds = seconds%60;
    let timeString = "";
    if(hours){
      timeString += hours + " hrs ";
    }
    if(minutes){
      timeString += minutes + " min ";
    }
    if(seconds){
      timeString += seconds+ " sec ";
    }
    if(!compressed){
      return timeString;
    }
    else{
      if(hours){
        return(`${hours}h`);
      }
      if(minutes){
        return(`${minutes}m`);
      }
      if(seconds){
        return(`${seconds}s`);
      }
    }
  };

function getDateString(nDate){
  let nDateDate=nDate.getDate();
  let nDateMonth=nDate.getMonth()+1;
  let nDateYear=nDate.getFullYear();
  if(nDateDate<10){nDateDate="0"+nDateDate;};
  if(nDateMonth<10){nDateMonth="0"+nDateMonth;};
  let presentDate = nDateYear+"-"+nDateMonth+"-"+nDateDate;
  return presentDate;
}
function getDomain(tablink){
  if(tablink){
    let url =  tablink[0].url;
    return url.split("/")[2];
  }
  else{
    return null;
  }
};

function updateTime() {
  chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (activeTab) {
    let domain = getDomain(activeTab);
    if (isValidURL(domain)) {
      let today = new Date();
      let presentDate = getDateString(today);
      let timeSoFar = 0;

      fetch("http://localhost:3000/update-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },  
        body: JSON.stringify({ date: presentDate, domain: domain })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to update time");
        }
        return response.json();
      })
      .then(data => {
        chrome.browserAction.setBadgeText({ 'text': secondsToString(timeSoFar, true) });
      })
      .catch(error => {
        console.error(error);
        chrome.browserAction.setBadgeText({ 'text': '' });
      });
    } else {
      chrome.browserAction.setBadgeText({ 'text': '' });
    }
  });
};


var intervalID;

intervalID = setInterval(updateTime,1000);
setInterval(checkFocus,500)

function checkFocus(){
  chrome.windows.getCurrent(function(window){
    if(window.focused){
      if(!intervalID){
        intervalID = setInterval(updateTime,1000);
      }
    }
    else{
      if(intervalID){
        clearInterval(intervalID);
        intervalID=null;
      }
    }
  });

  // chrome.tabs.query({ active: true , currentWindow: true }, function (tabs) {
  //   let domain = getDomain(tabs);
  //   if (domain === "www.youtube.com") {
  //     // Option 1: Redirect to a different page
  //     chrome.tabs.update(tabs[0].id, { url: "about:blank" });

  //     // Option 2: Close the tab (uncomment if needed)
  //     // chrome.tabs.remove(tabs[0].id);
  //   }
  // });


  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let domain = getDomain(tabs);
      if (domain) {
        // Fetch the list of blocked websites from the server
        fetch(`http://localhost:3000/blocked-websites?date1=${today1}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Failed to fetch blocked websites");
            }
            return response.json();
          })
          .then(blockedWebsites => {
            if (blockedWebsites.includes(domain)) {
              chrome.tabs.update(tabs[0].id, { url: chrome.extension.getURL("index.html")  });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    
  });

}

