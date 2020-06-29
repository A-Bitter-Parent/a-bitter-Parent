import React, { Component } from 'react';
import axios from 'axios';
import UserResults from './UserResults'

class Lunch extends Component {

    constructor() {
        super();
        this.state = {
            userInput: '',
            recoFoodTitle: '',
            sugarValue: '',
            usersFood: [],
            recommendedFood: [],
            checkReco: false,
            checkUserChoice: false,
        }
    }

    handleChange = (event) => {
        event.preventDefault();

        let userInput = this.state.userInput;
        let value = event.target.value;

        userInput = value;

        this.setState({
            userInput: userInput,
            checkUserChoice: false,
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.userInput !== this.state.userInput) {
            this.setState({
                checkReco: false,
                checkUserChoice: true
            })

            axios({
                url: 'https://trackapi.nutritionix.com/v2/search/instant',
                method: 'POST',
                responseType: 'JSON',
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": "2f61b616",
                    "x-app-key": "3c2af909b8bc091e21372b59a9e4b835",
                    "x-remote-user-id": "0"
                },
                data: {
                    "query": this.state.userInput,
                    "detailed": true,
                }
            }).then((response) => {
                console.log(response)
                console.log('initial request')

                const nutObj = response.data.common[0].full_nutrients;
                let sugarAmount;
                let fatAmount;
                let calorieAmount;
                let proteinAmount;
                let carbohydratesAmount;
                for (let i = 0; i < nutObj.length; i++) {
                    if (nutObj[i].attr_id === 269) {
                        sugarAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 204) {
                        fatAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 208) {
                        calorieAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 203) {
                        proteinAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 205) {
                        carbohydratesAmount = nutObj[i].value
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

                const newObj = [fatAmount, calorieAmount, sugarAmount, proteinAmount, carbohydratesAmount];
                this.setState({
                    usersFood: newObj,
                    sugarValue: sugarAmount
                })
                console.log(this.state.usersFood)
            })
        }
    }

    subClick = () => {
        this.setState({
            checkReco: true,
        })
        console.log(this.state.checkReco)

        const randItem = Math.floor(Math.random() * 20)

        if (this.state.sugarValue >= 10) {
            axios({
                url: 'https://trackapi.nutritionix.com/v2/search/instant',
                method: 'POST',
                responseType: 'JSON',
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": "2f61b616",
                    "x-app-key": "3c2af909b8bc091e21372b59a9e4b835",
                    "x-remote-user-id": "0"
                },
                data: {
                    "query": 'vegetables || fruits || grains',
                    "detailed": true,
                    "full_nutrients": {
                        "269": {
                            "lte": this.state.sugarValue - 10,
                        }
                    }
                }
            }).then((response) => {
                console.log(this.state.sugarValue)

                // console.log(response.data.common[0]);
                console.log('if first call is more than 10')

                const nutObj = response.data.common[randItem].full_nutrients;
                // console.log(nutObj)

                let sugarAmount;
                let fatAmount;
                let calorieAmount;
                let proteinAmount;
                let carbohydratesAmount;
                for (let i = 0; i < nutObj.length; i++) {
                    if (nutObj[i].attr_id === 269) {
                        sugarAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 204) {
                        fatAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 208) {
                        calorieAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 203) {
                        proteinAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 205) {
                        carbohydratesAmount = nutObj[i].value
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

                const newObj = [fatAmount, calorieAmount, sugarAmount, proteinAmount, carbohydratesAmount];
                this.setState({
                    recommendedFood: newObj,
                    recoFoodTitle: response.data.common[randItem].food_name
                })
                console.log(this.state.recommendedFood)
            }
            )
        } else if (this.state.sugarValue < 10) {
            axios({
                url: 'https://trackapi.nutritionix.com/v2/search/instant',
                method: 'POST',
                responseType: 'JSON',
                headers: {
                    "Content-Type": "application/json",
                    "x-app-id": "2f61b616",
                    "x-app-key": "3c2af909b8bc091e21372b59a9e4b835",
                    "x-remote-user-id": "0"
                },
                data: {
                    "query": 'vegetables || fruits || grains',
                    "detailed": true,
                    "full_nutrients": {
                        "269": {
                            "lte": this.state.sugarValue,
                        }
                    }
                }
            }).then((response) => {
                console.log(response.data.common[randItem]);
                console.log('if first call is less than 10 but greater than 0')

                if (response.data.common[randItem] === undefined) {
                    alert('Go ahead! Eat it!')
                }
                const nutObj = response.data.common[randItem].full_nutrients;
                let sugarAmount;
                let fatAmount;
                let calorieAmount;
                let proteinAmount;
                let carbohydratesAmount;
                for (let i = 0; i < nutObj.length; i++) {
                    if (nutObj[i].attr_id === 269) {
                        sugarAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 204) {
                        fatAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 208) {
                        calorieAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 203) {
                        proteinAmount = nutObj[i].value
                    } else if (nutObj[i].attr_id === 205) {
                        carbohydratesAmount = nutObj[i].value
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

                const newObj = [fatAmount, calorieAmount, sugarAmount, proteinAmount, carbohydratesAmount];
                this.setState({
                    recommendedFood: newObj,
                    recoFoodTitle: response.data.common[randItem].food_name

                })
                console.log(this.state.recommendedFood)
            })

        } else {
            alert('Go ahead! Eat it!')
        }
    }



    render() {
        return (
            <div className="Lunch">
                <form className='foodSelector'>
                    <label htmlFor="foodMenu">Select what you would Like</label>
                    <select id='foodMenu' onChange={this.handleChange}>
                        <option  disabled selected>Choose your food</option>
                        <option value="chicken sandwich">Chicken Sandwich</option>
                        <option value="BLT">BLT</option>
                        <option value="cheeseburger">Cheeseburger</option>
                        <option value="Ramen">Ramen</option>
                        <option value="caesar salad">Caesar Salad</option>
                        <option value="dumplings">Dumplings</option>
                        <option value="grilled cheese">Grilled Cheese</option>
                        <option value="california roll">California Roll</option>
                        <option value="tacos">tacos</option>
                        <option value="cake">Cake</option>
                    </select>
                </form>
                <UserResults results={this.state} subClick={this.subClick} />
            </div>

        )
    }
}

export default Lunch;