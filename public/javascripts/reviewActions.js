window.onload = () => {
  const axiosHandler = new AxiosHandler("http://iron-games.herokuapp.com");

  let removeReview = document.querySelectorAll(".remove-review");
  const container = document.querySelector(".review-container");

  const callRemove = () => {
    removeReview.forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.children[0].innerHTML;
        axiosHandler.removeReview(id).then((res) => {
          container.innerHTML = "";
          console.log(res)
          if(res) {
            res.data.forEach(
              ({
                _doc: { user, comment, created_at, downvote, upvote, _id },
                sessionUserRev,
              }) => {
                container.innerHTML += `
                <div class="card text-dark bg-light my-4">
                  <div class="h5 card-header d-flex align-items-center justify-content-between">
                    <div>
                      ${
                        user
                          ? `<a href="/user/${user._id}"><img src="${user.profile_pic}" alt="user-pic" class="review-avatar"></a>
                      <span class="mx-4">${user.name}</span>`
                          : `<img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" alt="user-pic"
                        class="review-avatar"></a> <span class="mx-4">Unknown</span>`
                      }
                    </div>

                    <div class="reviews-actions d-flex">
                      ${
                        sessionUserRev
                          ? `
                      <form action="/review/${_id}/edit" method="GET">
                        <button type="submit"><i class="far fa-edit"></i></button>
                      </form>
                      <button class="remove-review far fa-trash-alt"><span class="hide">${_id}</span></button>
                      `
                          : ``
                      }
                    </div>
                  </div>
                  <div class="card-body">
                    <p class="card-text">${comment}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between reviews-actions">
                    <div class="d-flex">
                      <form action="/review/${_id}/upvote" method="POST">
                        <button type="submit" ${
                          !sessionUserRev
                            ? 'class="upvote fas fa-arrow-circle-up"'
                            : ""
                        } class="fas fa-arrow-circle-up" ${
                  sessionUserRev ? "disabled" : ""
                }><span>
                            ${upvote} </span></button>
                      </form>
                      <form action="/review/{{_id}}/downvote" method="POST">
                        <button type="submit" ${
                          !sessionUserRev
                            ? 'class="downvote fas fa-arrow-circle-down"'
                            : ""
                        } class="fas fa-arrow-circle-down" ${
                  sessionUserRev ? "disabled" : ""
                }><span>
                            ${downvote} </span></button>
                      </form>
                    </div>
                    <div>
                      <span class="float-end">${created_at}</span>
                    </div>
                  </div>
                </div>
                `;
              }
            );
          }
          removeReview = document.querySelectorAll(".remove-review");
          callRemove();
        });
      });
    });
  };
  callRemove();
};
