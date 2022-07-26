/**
 * Licence?? ya, I did wrote this cause I saw it everywhere and I have no idea what it does.
 * I just made this project as a fun project and to experiment with something new.
 * The code might be messy and there might be alternative and better way of doing some stuff.
 * It's now opensource YAY!! (not that anyone cares offcourse)
 * Author: @NamelessXDev aka @En3X
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

chrome.runtime.onMessage.addListener((message, sender, response) => {
  const { id, command, data } = message;
  if (command == "fetchData") {
    embedStata(id, data);
  }
});

embedStata = (id, data) => {
  if (document.querySelector("#statadiv") !== null) {
    let tempDiv = document.querySelector("#statadiv");
    if (
      tempDiv.getAttribute("data-video") != null &&
      tempDiv.getAttribute("data-video") != id
    ) {
      document
        .querySelector("#secondary")
        .removeChild(document.querySelector("#statadiv"));
    } else {
      return;
    }
  }
  // console.log('Fetching data for video with id '+id);
  var snippet = data.items[0].snippet;
  var thumbnail =
    snippet.thumbnails.standard ??
    snippet.thumbnails.high ??
    snippet.thumbnails.medium;
  // Some basic details
  var videoId = id;
  var vidTitle = snippet.title ?? "Not found";
  var description = snippet.description ?? "Not found";
  var publishDate = new Date(snippet.publishedAt);
  var channelTitle = snippet.channelTitle ?? "Not found";
  // var thumbnailRes = `${thumbnail.width} x ${thumbnail.height}`;
  var thumbnailUrl = thumbnail.url ?? "Not found";
  // Statistics
  var stats = data.items[0].statistics ?? "Not found";

  var views = stats.viewCount ?? "Not found";
  var like = stats.likeCount ?? "Not found";
  var comments = stats.commentCount ?? "Not found";
  var tags = snippet.tags ?? "Not found";
  let pubDate = `${publishDate.getDate()} ${
    MONTHS[publishDate.getMonth()]
  }, ${publishDate.getFullYear()}`;
  var stataBox = getStatsBox(
    videoId,
    vidTitle,
    description,
    thumbnailUrl,
    channelTitle,
    pubDate,
    tags,
    views,
    like,
    comments
  );
  setTimeout(() => {
    var secondary = document.querySelector("#secondary");
    if (document.querySelector("#statadiv") == null) {
      secondary.prepend(stataBox);
    } else {
      secondary.removeChild(document.querySelector("#statadiv"));
      secondary.prepend(stataBox);
    }
  }, 3000);
};

function getStatsBox(
  id,
  title,
  description,
  imgSrc,
  channelName,
  publishDate,
  tags,
  views,
  likes,
  comments
) {
  let wrapper = document.createElement("div");
  wrapper.classList = "statabox roboto";
  wrapper.id = "statadiv";
  wrapper.setAttribute("data-video", id);
  let titleDiv = document.createElement("div");
  titleDiv.title = title;
  titleDiv.classList = "title clamp";
  titleDiv.setAttribute("style", "--line-clamp: 1");
  titleDiv.innerText = title;

  let descriptionDiv = document.createElement("div");
  descriptionDiv.title = description;
  descriptionDiv.classList = "description clamp";
  descriptionDiv.setAttribute("style", "--line-clamp: 2");
  descriptionDiv.innerText = description;

  let thumbnailDiv = document.createElement("div");
  thumbnailDiv.addEventListener("click", () => {
    fetch(imgSrc)
      .then((res) => {
        return res.blob();
      })
      .then((data) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = `Thumbnail-${id}.jpg`;
        a.click();
      });
  });
  thumbnailDiv.classList = "thumbnail";
  img = document.createElement("img");
  img.src = imgSrc;
  img.title = "Click to download this thumbnail";

  thumbnailDiv.appendChild(img);

  let minorDetailDiv = document.createElement("div");
  minorDetailDiv.classList = "description";
  minorDetailDiv.innerHTML = `
        Video By: <b> ${channelName}<br>
        Published On: ${publishDate}
    `;

  let tagTitleDiv = document.createElement("div");
  tagTitleDiv.classList = "description";
  tagTitleDiv.innerText = "Tags Used";

  let tagsDiv = document.createElement("div");
  tagsDiv.classList = "tags";

  if (tags == "Not found") {
    tagsDiv.innerHTML = "Tags not found";
    tagsDiv.classList += "description";
  } else {
    tags.forEach((tag) => {
      tagcapsule = document.createElement("div");
      tagcapsule.classList = "tagcapsule description";
      tagcapsule.innerText = tag;
      tagsDiv.appendChild(tagcapsule);
    });
  }

  /* I commented out stats, you can uncomment it if you want to */

  // let statsDiv = document.createElement("div");
  // statsDiv.classList = "stats";
  // statsDiv.innerHTML = `
  //       <div class='stat-group'>
  //           <ion-icon name='eye-outline'></ion-icon> ${views}
  //       </div>
  //       <div class='stat-group'>
  //           <ion-icon name='thumbs-up-outline'></ion-icon> ${likes}
  //       </div>
  //       <div class='stat-group'>
  //           <ion-icon name='mail-open-outline'></ion-icon> ${comments}
  //       </div>
  //   `;

  let devDiv = document.createElement("div");
  devDiv.classList = "stats";
  devDiv.textContent = `
        Developed by En3X Dev
    `;

  wrapper.appendChild(titleDiv);
  wrapper.appendChild(descriptionDiv);
  wrapper.appendChild(thumbnailDiv);
  wrapper.appendChild(minorDetailDiv);
  wrapper.appendChild(tagTitleDiv);
  wrapper.appendChild(tagsDiv);
  wrapper.appendChild(devDiv);

  return wrapper;
}
