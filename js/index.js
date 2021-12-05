document.addEventListener("DOMContentLoaded", () => {
  console.log("dom loaded")

  const form = document.querySelector("#github-form")

  const btn = document.createElement("button")
  btn.id = "toggle"
  btn.innerText = "users"
  const main = document.querySelector("#main")
  main.insertBefore(btn, form.nextSibling)

  const toggle = document.querySelector("#toggle")
  toggle.addEventListener("click", toggleSearch)

  form.addEventListener("submit", handleSubmit)
})
  
let toggleOn = false

function toggleSearch() {
  if (toggleOn === false) {
    toggleOn = true
    toggle.innerText = "repos"
  }
  else if (toggleOn === true) {
    toggleOn = false
    toggle.innerText = "users"
  }
  console.log(toggleOn)
}

function handleSubmit(e) {
  e.preventDefault()

  const userList = document.querySelector("#user-list")
  const repoList = document.querySelector("#repos-list")

  while (userList.firstChild) {
    userList.removeChild(userList.firstChild)
  }
  while (repoList.firstChild) {
    repoList.removeChild(repoList.firstChild)
  }
  
  const search = document.querySelector("#search")
  if (toggleOn === false) {
    fetchUser(search.value)
  }
  else if (toggleOn === true) {
    fetchRepo(search.value)
  }

  document.querySelector("form").reset()
}

function handleClick(e) {
  while (document.querySelector("#repos-list").firstChild) {
    document.querySelector("#repos-list").removeChild(document.querySelector("#repos-list").firstChild)
  }

  fetchRepo(e.target.id)
}

function renderUsers(user) {
  const li = document.createElement("li")
  document.querySelector("#user-list").appendChild(li)

  const img = document.createElement("img")
  img.setAttribute("src", user.avatar_url)
  img.setAttribute("alt", user.login)
  img.id = user.login
  img.style.width = "180px"
  li.appendChild(img)

  const p = document.createElement("p")
  p.innerText = user.login
  p.id = user.login
  li.appendChild(p)

  const link = document.createElement("a")
  link.setAttribute("href", user.html_url)
  link.setAttribute("target", "_blank")
  link.innerText = `${user.login}'s Profile Link`
  li.appendChild(link)

  li.addEventListener("click", handleClick)
}

function renderRepos(repo) {
  const li = document.createElement("li")
  li.innerText = repo.full_name
  document.querySelector("#repos-list").appendChild(li)
}

function fetchUser(users) {
  fetch(`https://api.github.com/search/users?q=${users}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
    }
  })
  .then(res => res.json())
  .then(userData => {
    userData.items.forEach(user => {
      renderUsers(user)
    })
  })
}

function fetchRepo(repos) {
  fetch(`https://api.github.com/users/${repos}/repos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
    }
  })
  .then(res => res.json())
  .then(repoData => {
    repoData.forEach(repo => {
      renderRepos(repo)
    })
  })
}
