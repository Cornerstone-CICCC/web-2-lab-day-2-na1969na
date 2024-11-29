$(function () {
  let currentUserId = 1;
  const totalUsers = 30;

  function fetchUserData(userId) {
    $.ajax({
      url: `https://dummyjson.com/users/${userId}`,
      method: "GET",
      success: function (data) {
        $(".info__image img").attr("src", data.image);
        $(".info__content").html(`
          <h2>${data.firstName} ${data.lastName}</h2>
          <p><span>Age: </span>${data.age}</p>
          <p><span>Email: </span>${data.email}</p>
          <p><span>Phone: </span>${data.phone}</p>
        `);
        fetchUserPosts(userId);
        fetchUserTodos(userId);
        $(".posts h3").text(`${data.firstName}'s Posts`);
        $(".todos h3").text(`${data.firstName}'s To Dos`);
      },
    });
  }

  function fetchUserPosts(userId) {
    $.ajax({
      url: `https://dummyjson.com/users/${userId}/posts`,
      method: "GET",
      success: function (data) {
        const posts = data.posts;
        if (posts.length === 0) {
          $(".posts ul").html("<li><p>User has no posts</p></li>");
        } else {
          const postsHtml = posts
            .map(
              (post) => `
              <li>
                <h4 data-post-id="${post.id}">${post.title}</h4>
                <p>${post.body}</p>
              </li>
            `
            )
            .join("");
          $(".posts ul").html(postsHtml);
        }
      },
      error: function (xhr, status, error) {
        console.error("Failed to fetch posts:", error);
        $(".posts ul").html("<p>Failed to load posts.</p>");
      },
    });
  }

  function fetchUserTodos(userId) {
    $.ajax({
      url: `https://dummyjson.com/users/${userId}/todos`,
      method: "GET",
      success: function (data) {
        const todos = data.todos;
        if (todos.length === 0) {
          $(".todos ul").html("<li><p>User has no todos</p></li>");
        } else {
          const todosHtml = todos
            .map(
              (todo) => `
          <li>${todo.todo}</li>
        `
            )
            .join("");
          $(".todos ul").html(todosHtml);
        }
      },
    });
  }

  function showModal(postId) {
    $.ajax({
      url: `https://dummyjson.com/posts/${postId}`,
      method: "GET",
      success: function (data) {
        const modal = $(`
          <div class="overlay">
            <div class="modal">
              <h2>${data.title}</h2>
              <p>${data.body}</p>
              <p><em>Views: ${data.views}</em></p>
              <button class="close-modal">Close Modal</button>
            </div>
          </div>
        `);
        $("body").append(modal);
        $(".close-modal").on("click", function () {
          $(".overlay").remove();
        });
      },
    });
  }

  $("header button").on("click", function () {
    if ($(this).text().includes("Previous")) {
      currentUserId = currentUserId === 1 ? totalUsers : currentUserId - 1;
    } else {
      currentUserId = currentUserId === totalUsers ? 1 : currentUserId + 1;
    }
    fetchUserData(currentUserId);
  });

  $(".posts ul").on("click", "h4", function () {
    const postId = $(this).data("post-id");
    showModal(postId);
  });

  $("h3").on("click", function () {
    $(this).next("ul").slideToggle();
  });

  fetchUserData(currentUserId);
});
