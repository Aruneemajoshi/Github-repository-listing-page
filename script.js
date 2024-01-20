function getRepositories() {
    const username = document.getElementById("username").value;
    const loader = document.getElementById("loader");
    const userProfileDiv = document.getElementById("userProfile");
    const repositoriesDiv = document.getElementById("repositories");
    const paginationDiv = document.getElementById("pagination");

    loader.style.display = "block";
    userProfileDiv.innerHTML = "";
    repositoriesDiv.innerHTML = "";
    paginationDiv.innerHTML = "";

    
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=10`;

    $.ajax({
        url: apiUrl,
        dataType: 'json',
        success: function (userData, textStatus, xhr) {
            loader.style.display = "none";

            if (xhr.status === 200) {
                displayUserProfile(userData[0].owner);
                displayRepositories(userData);
                displayPagination(xhr.getResponseHeader('Link'));
            } else {
                repositoriesDiv.innerHTML = `<p>Error: ${userData.message}</p>`;
            }
        },
        error: function (xhr, textStatus, error) {
            loader.style.display = "none";
            repositoriesDiv.innerHTML = `<p>Error: ${error}</p>`;
        }
    });
}

function displayUserProfile(owner) {
    const userProfileDiv = document.getElementById("userProfile");
    userProfileDiv.innerHTML = `
        <img src="${owner.avatar_url}" alt="Profile Picture" class="profile-picture">
        <div>
            <p><strong>Name:</strong> ${owner.login}</p>
            <p><strong>GitHub Profile:</strong> <a href="${owner.html_url}" target="_blank">${owner.login}</a></p>
        </div>
    `;
}

function displayRepositories(repositories) {
    const repositoriesDiv = document.getElementById("repositories");

    repositories.forEach(repo => {
        const repoDiv = document.createElement("div");
        repoDiv.className = "repository";
        repoDiv.innerHTML = `<h3>${repo.name}</h3><p>${repo.description || "No description available."}</p>`;
        repositoriesDiv.appendChild(repoDiv);
    });
}

function displayPagination(linkHeader) {
    const paginationDiv = document.getElementById("pagination");

    if (!linkHeader) return;

    const links = linkHeader.split(',');
    const regex = /<([^>]+)>; rel="(\w+)"/;

    links.forEach(link => {
        const match = link.match(regex);
        if (match) {
            const url = match[1];
            const rel = match[2];
            const pageNumber = new URL(url).searchParams.get('page');
            const linkButton = document.createElement("button");
            linkButton.innerText = pageNumber;
            linkButton.onclick = function () {
                getRepositoriesWithPage(url);
            };
            paginationDiv.appendChild(linkButton);
        }
    });
}

function getRepositoriesWithPage(url) {
    const loader = document.getElementById("loader");
    const repositoriesDiv = document.getElementById("repositories");
    const paginationDiv = document.getElementById("pagination");

    loader.style.display = "block";
    repositoriesDiv.innerHTML = "";
    paginationDiv.innerHTML = "";

    $.ajax({
        url: url,
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            loader.style.display = "none";

            if (xhr.status === 200) {
                displayRepositories(data);
                displayPagination(xhr.getResponseHeader('Link'));
            } else {
                repositoriesDiv.innerHTML = `<p>Error: ${data.message}</p>`;
            }
        },
        error: function (xhr, textStatus, error) {
            loader.style.display = "none";
            repositoriesDiv.innerHTML = `<p>Error: ${error}</p>`;
        }
    });
}
