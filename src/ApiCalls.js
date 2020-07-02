import React, { Component } from "react";
import axios from "axios";
import UserInput from "./components/UserInput";
import firebase from "./firebase";
import DisplaySavedFoods from "./components/DisplaySavedFoods";

class ApiCalls extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      recoFoodTitle: "",
      sugarValue: "",
      usersFood: [],
      recommendedFood: [],
      checkReco: false,
      checkUserChoice: false,
      breakfast: false,
      lunch: false,
      dinner: false,
      snack: false,
      userImage: "",
      userImageAlt: "",
      recoImage: "",
      recoImageAlt: "",
      firebaseObj: {},
      // unsplashKey: 'XOIxVf1JifM9_NSItXssxrkEDz917Vsu03WTP2T6nbA',
      unsplashKey: 'wPc_7irjVjTU9ez7gjehFg6qAyrOd2HEkx_YY397uts',

    };
  }

  handleChange = (event) => {
    event.preventDefault();

    let userInput = this.state.userInput;
    let value = event.target.value;

    userInput = value;

    this.setState({
      userInput: userInput,
      checkUserChoice: false,
    });
    console.log(this.state.checkUserChoice);
  };

  handleBreakfastClick = () => {
    this.setState({
      breakfast: true,
      lunch: false,
      dinner: false,
      snack: false,
      checkUserChoice: false,
      checkReco: false,
    });
  };
  handleLunchClick = () => {
    this.setState({
      breakfast: false,
      lunch: true,
      dinner: false,
      snack: false,
      checkUserChoice: false,
      checkReco: false,
    });
  };
  handleDinnerClick = () => {
    this.setState({
      breakfast: false,
      lunch: false,
      dinner: true,
      snack: false,
      checkUserChoice: false,
      checkReco: false,
    });
  };
  handleSnackClick = () => {
    this.setState({
      breakfast: false,
      lunch: false,
      dinner: false,
      snack: true,
      checkUserChoice: false,
      checkReco: false,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userInput !== this.state.userInput) {
      this.setState({
        checkReco: false,
        checkUserChoice: true,
      });

      axios({
        url: "https://api.unsplash.com/photos/random",
        method: "GET",
        responseType: "JSON",
        params: {
          client_id: this.state.unsplashKey,
          query: `${this.state.userInput} plate`,
        },
      }).then((response) => {
        console.log(response);

        let unsplashUrl = response.data.urls.small;
        let altTag = response.data.alt_description;

        this.setState({
          userImage: unsplashUrl,
          userImageAlt: altTag,
        });
      });

      axios({
        url: "https://trackapi.nutritionix.com/v2/search/instant",
        method: "POST",
        responseType: "JSON",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": "2f61b616",
          "x-app-key": "3c2af909b8bc091e21372b59a9e4b835",
          "x-remote-user-id": "0",
        },
        data: {
          query: this.state.userInput,
          detailed: true,
        },
      }).then((response) => {
        console.log(response);
        console.log("initial request");

        const nutObj = response.data.common[0].full_nutrients;
        let sugarAmount;
        let fatAmount;
        let calorieAmount;
        let proteinAmount;
        let carbohydratesAmount;
        for (let i = 0; i < nutObj.length; i++) {
          if (nutObj[i].attr_id === 269) {
            sugarAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 204) {
            fatAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 208) {
            calorieAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 203) {
            proteinAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 205) {
            carbohydratesAmount = nutObj[i].value;
          }
        }

        if (fatAmount === undefined) {
          fatAmount = 0;
        } else if (calorieAmount === undefined) {
          calorieAmount = 0;
        } else if (proteinAmount === undefined) {
          proteinAmount = 0;
        } else if (carbohydratesAmount === undefined) {
          carbohydratesAmount = 0;
        }

        const newObj = [
          fatAmount,
          calorieAmount,
          sugarAmount,
          proteinAmount,
          carbohydratesAmount,
        ];
        this.setState({
          usersFood: newObj,
          sugarValue: sugarAmount,
        });
        console.log(this.state.usersFood);
      });
    }
  }

  handleSave = (event) => {
    console.log("clicked");
    event.preventDefault();
    const dbRef = firebase.database().ref();
    let userFoodOption = this.state.usersFood;
    let userRecoOption = this.state.recommendedFood;
    let userFoodName = this.state.userInput;
    let userRecoName = this.state.recoFoodTitle;

    const firebaseObj = {
      food1: { userFoodName, userFoodOption },
      food2: { userRecoName, userRecoOption },
    };
    console.log(firebaseObj);
    dbRef.push(firebaseObj);
  };

  subClick = () => {
    this.setState({
      checkReco: true,
    });
    console.log(this.state.checkReco);

    let randItem = 1;

    let noOfRes;
    // console.log(noOfRes)
    if ((noOfRes = 20)) {
      randItem = Math.floor(Math.random() * 20);
    } else {
      randItem = Math.floor(Math.random() * noOfRes);
    }

    if (this.state.sugarValue >= 10) {
      axios({
        url: "https://trackapi.nutritionix.com/v2/search/instant",
        method: "POST",
        responseType: "JSON",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": "2f61b616",
          "x-app-key": "3c2af909b8bc091e21372b59a9e4b835",
          "x-remote-user-id": "0",
        },
        data: {
          query: "vegetables || fruits || grains",
          detailed: true,
          full_nutrients: {
            "269": {
              lte: this.state.sugarValue - 10,
            },
          },
        },
      }).then((response) => {
        console.log(this.state.sugarValue);
        console.log(response.data.common.length);

        console.log("if first call is more than 10");

        const nutObj = response.data.common[randItem].full_nutrients;
        // console.log(nutObj)

        let sugarAmount;
        let fatAmount;
        let calorieAmount;
        let proteinAmount;
        let carbohydratesAmount;
        for (let i = 0; i < nutObj.length; i++) {
          if (nutObj[i].attr_id === 269) {
            sugarAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 204) {
            fatAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 208) {
            calorieAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 203) {
            proteinAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 205) {
            carbohydratesAmount = nutObj[i].value;
          }
        }

        if (fatAmount === undefined) {
          fatAmount = 0;
        } else if (calorieAmount === undefined) {
          calorieAmount = 0;
        } else if (proteinAmount === undefined) {
          proteinAmount = 0;
        } else if (carbohydratesAmount === undefined) {
          carbohydratesAmount = 0;
        }

        const newObj = [
          fatAmount,
          calorieAmount,
          sugarAmount,
          proteinAmount,
          carbohydratesAmount,
        ];
        this.setState({
          recommendedFood: newObj,
          recoFoodTitle: response.data.common[randItem].food_name,
        });
        console.log(this.state.recommendedFood);

        noOfRes = this.state.recommendedFood.length;
        console.log(noOfRes);
      });

      axios({
        url: 'https://api.unsplash.com/photos/random',
        method: "GET",
        responseType: "JSON",
        params: {
          client_id: `${this.state.unsplashKey} plate`,
          query: this.state.recoFoodTitle,
        },
      }).then((response) => {

        let unsplashUrl = response.data.urls.small;
        let altTag = response.data.alt_description;

        this.setState({
          recoImage: unsplashUrl,
          recoImageAlt: altTag
        })
      });
      console.log(this.state.recoFoodTitle);
    } else if (this.state.sugarValue < 10) {
      axios({
        url: "https://trackapi.nutritionix.com/v2/search/instant",
        method: "POST",
        responseType: "JSON",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": "2f61b616",
          "x-app-key": "3c2af909b8bc091e21372b59a9e4b835",
          "x-remote-user-id": "0",
        },
        data: {
          query: "vegetables || fruits || grains",
          detailed: true,
          full_nutrients: {
            "269": {
              lte: this.state.sugarValue,
            },
          },
        },
      }).then((response) => {
        console.log(response.data.common[randItem]);
        console.log("if first call is less than 10 but greater than 0");

        if (response.data.common[randItem] === undefined) {
          alert("Go ahead! Eat it!");
        }
        const nutObj = response.data.common[randItem].full_nutrients;
        let sugarAmount;
        let fatAmount;
        let calorieAmount;
        let proteinAmount;
        let carbohydratesAmount;
        for (let i = 0; i < nutObj.length; i++) {
          if (nutObj[i].attr_id === 269) {
            sugarAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 204) {
            fatAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 208) {
            calorieAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 203) {
            proteinAmount = nutObj[i].value;
          } else if (nutObj[i].attr_id === 205) {
            carbohydratesAmount = nutObj[i].value;
          }
        }

        if (fatAmount === undefined) {
          fatAmount = 0;
        } else if (calorieAmount === undefined) {
          calorieAmount = 0;
        } else if (proteinAmount === undefined) {
          proteinAmount = 0;
        } else if (sugarAmount === undefined) {
          sugarAmount = 0;
        } else if (carbohydratesAmount === undefined) {
          carbohydratesAmount = 0;
        }

        const newObj = [
          fatAmount,
          calorieAmount,
          sugarAmount,
          proteinAmount,
          carbohydratesAmount,
        ];
        this.setState({
          recommendedFood: newObj,
          recoFoodTitle: response.data.common[randItem].food_name,
        });

        console.log(this.state.recoFoodTitle);

        axios({
          url: "https://api.unsplash.com/photos/random",
          method: "GET",
          responseType: "JSON",
          params: {
            client_id: this.state.unsplashKey,
            query: `${this.state.recoFoodTitle} plate`,
          },
        }).then((response) => {

          console.log(response);
          
          let unsplashUrl = response.data.urls.small;
          let altTag = response.data.alt_description;

          this.setState({
            recoImage: unsplashUrl,
            recoImageAlt: altTag,
          });
        });
      });
    } else {
      alert("Go ahead! Eat it!");
    }
  };
  render() {
    return (
      <div>
        <UserInput
          results={this.state}
          handleChange={this.handleChange}
          subClick={this.subClick}
          handleBreakfastClick={this.handleBreakfastClick}
          handleLunchClick={this.handleLunchClick}
          handleDinnerClick={this.handleDinnerClick}
          handleSnackClick={this.handleSnackClick}
          handleSave={this.handleSave}
        />
        {this.state.checkReco ? (
          <button onClick={this.handleSave}>Save selection</button>
        ) : null}
        {this.state.checkReco ? <DisplaySavedFoods /> : null}
      </div>
    );
  }
}

export default ApiCalls;
