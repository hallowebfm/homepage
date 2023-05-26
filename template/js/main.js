const url = "https://anchor.fm/s/d8bc85e4/podcast/rss";

const emptyColumnTemplate = '<div class="column"></div>';

const cardTemplate = ({
  title,
  description,
  link,
  imageUrl,
  season,
  episode,
}) => `<div class="column displayGrid">
                <div class="card">
                    <div class="card-image">
                    <a href="${link}">
                        <figure class="image is-4by3">
                            <img src="${imageUrl}" />
                        </figure>
                        </a>
                    </div>
                    <div class="card-content">
                        <div class="media">
                          
                            <div class="media-content">
                                <p class="title is-4"> ${title}</p>
                                <p class="subtitle is-6">
                                  Staffel <strong>${season}</strong> 
                                  Folge <strong>${episode}</strong >
                                </p>
                            </div>
                        </div>

                        <div class="content">
                        ${description}
                        </div>
                    </div>
                </div>
            </div>`;

const wrapWithColumnContainer = (row) =>
  `<div class="columns is-desktop">${row.join(" ")}</div>`;

const buildCards = (episodes) => {
  const EPISODES_IN_A_ROW = 3;
  let template = "";
  let row = [];
  episodes.forEach((episode, index) => {
    row.push(cardTemplate(episode));

    if ((index + 1) % 3 === 0) {
      template += wrapWithColumnContainer(row);
      row = [];
    }
    if (index === episodes.length - 1) {
      const quantityInLastRow = EPISODES_IN_A_ROW - row.length;
      if (quantityInLastRow > 0) {
        for (let index = 0; index < quantityInLastRow; index++) {
          row.push(emptyColumnTemplate);
        }
      }

      template += wrapWithColumnContainer(row);
    }
  });

  return template;
};

const attachToContainer = (content) => {
  document.getElementById("epdisodes").innerHTML = content;
};

fetch(url)
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    let parser = new DOMParser(),
      xmlDoc = parser.parseFromString(data, "text/xml");

    const items = [...xmlDoc.getElementsByTagName("item")];

    const parsedData = items.map((episode) => {
      return {
        title: episode.getElementsByTagName("title")[0].textContent,
        description: episode.getElementsByTagName("description")[0].textContent,
        link: episode.getElementsByTagName("link")[0].textContent,
        imageUrl: episode
          .getElementsByTagName("itunes:image")[0]
          .getAttribute("href"),
        season:
          episode.getElementsByTagName("itunes:season") &&
          episode.getElementsByTagName("itunes:season").length > 0 &&
          episode.getElementsByTagName("itunes:season")[0].textContent,
        episode:
          episode.getElementsByTagName("itunes:episode") &&
          episode.getElementsByTagName("itunes:episode").length > 0 &&
          episode.getElementsByTagName("itunes:episode")[0].textContent,
      };
    });

    const template = buildCards(parsedData);

    attachToContainer(template);
  })
  .catch(function (error) {
    // console.log(error);
    console.log("Cannot request the rss of the podcast", error);
  });
