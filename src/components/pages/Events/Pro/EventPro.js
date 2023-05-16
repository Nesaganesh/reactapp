
import React from 'react';
import './css/style.css'

function EventPro() {
  return (
    <>

    <nav class="navbar navbar-inverse">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#"
            ><img src="./images/FlyToezLogo.jpg" width="150"
          /></a>
        </div>
      </div>
    </nav>
    <div class="hero">
      <img src="./images/banner.jpg" class="img-fluid" alt="Responsive image" />
    </div>

    <div class="container">
      <div class="row main-heading">
        <div class="col-sm-9">
          <h1>Book tickets for best upcoming New Year Parties Events</h1>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-sm-8">
          <div class="ticket-panel">
            <div class="heading-bg">
              <h4>Ticket Price</h4>
            </div>
            <div class="padd-30">
              <p>Adult X 1 = <span class="font-weight-bold">£20</span></p>
              <p>
                Child between 5-13 years X 1 =
                <span class="font-weight-bold">£10</span>
              </p>
              <p class="alert alert-primary">
                Note: Free for child below 5 years
              </p>
            </div>
          </div>
          <div class="otherdetail-panel">
            <div class="heading-bg">
              <h4>Other Details</h4>
            </div>

            <form>
              <div class="padd-30">
                <div class="form-row">
                  <div class="form-group col-md-4">
                    <label for="exampleFormControlSelect1"
                      >Adult above 14years</label
                    >
                    <select class="form-control" id="adultFormControlSelect">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </div>
                  <div class="form-group col-md-4">
                    <label for="exampleFormControlSelect1"
                      >Child above 5years</label
                    >
                    <select class="form-control" id="adultFormControlSelect">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </div>
                  <div class="form-group col-md-4">
                    <label for="exampleFormControlSelect1"
                      >Child below 5years</label
                    >
                    <select class="form-control" id="adultFormControlSelect">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="inputName">Name</label>
                  <input type="text" class="form-control" id="inputName" />
                </div>
                <fieldset class="form-group">
                  <div class="row">
                    <legend class="col-form-label col-sm-2 pt-0">Food</legend>
                    <div class="col-sm-10">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="gridRadios"
                          id="gridRadios1"
                          value="option1"
                          checked
                        />
                        <label class="form-check-label" for="gridRadios1">
                          Veg
                        </label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="gridRadios"
                          id="gridRadios2"
                          value="option2"
                        />
                        <label class="form-check-label" for="gridRadios2">
                          Non-Veg
                        </label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="gridRadios"
                          id="gridRadios3"
                          value="option3"
                        />
                        <label class="form-check-label" for="gridRadios3">
                          Vegan
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <div class="form-group">
                  <label for="DietanaryFormControlTextarea"
                    >Dietanary Comments</label
                  >
                  <textarea
                    class="form-control"
                    id="DietanaryFormControlTextarea"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="inputEmail">Email</label>
                  <input type="email" class="form-control" id="inputEmail" />
                </div>

                <div class="form-group">
                  <label for="inputPhone">Phone</label>
                  <input type="text" class="form-control" id="inputPhone" />
                </div>

                <div class="form-group row">
                  <div class="col-sm-12">
                    <label>Terms & Conditions Read Now</label>
                  </div>

                  <div class="col-sm-12">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="gridCheck1"
                      />
                      <label class="form-check-label" for="gridCheck1">
                        Are you happy for FDC to store your details until the
                        time you have a business with us.
                      </label>
                    </div>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-10">
                    <button type="submit" class="btn btn-primary">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="adv-panel">
            <img width="200" src="./images/Diwali_Final_poster_2.png" />
          </div>
        </div>

        <div class="iconGroupImgII d-none d-sm-block">
          <span class="position-absolute icnImg" data-icon="iconImgII">
            <img src="./images/icon2.png" class="img-fluid" alt="icon" />
          </span>
          <span class="position-absolute icnImg" data-icon="iconImgIII">
            <img src="./images/icon3.png" class="img-fluid" alt="icon" />
          </span>
          <span class="position-absolute icnImg" data-icon="iconImgIV">
            <img src="./images/icon4.png" class="img-fluid" alt="icon" />
          </span>
          <span class="position-absolute icnImg" data-icon="iconImgV">
            <img src="./images/icon5.png" class="img-fluid" alt="icon" />
          </span>
          <span class="position-absolute icnImg" data-icon="iconImgVI">
            <img src="./images/icon6.png" class="img-fluid" alt="icon" />
          </span>
        </div>
      </div>
    </div>

        
    </>
  );
}

export default EventPro;