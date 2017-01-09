/**
 * Created by michaelmatias on 1/6/17.
 */
export class AppSettings {
  public static get SUBMIT_ORDER_URL(): string { return 'http://localhost:4338/submitOrder/' }
  public static get GET_MEAL_DETAILS(): string { return 'http://localhost:4338/mealDetails/' }
  public static get API_ENDPOINT(): string { return 'http://localhost:4338/api/'; }
  public static get MEAL_DETAILS(): Object { return {
    "baget": {
      "id": 1,
      "displayName": "Baget",
      "imgUrl": "../../assets/img/meal-type/card-saopaolo.png",
      "price": "20NIS"
    },
    "salad": {
      "id": 2,
      "displayName": "Salad",
      "imgUrl": "../../assets/img/meal-type/card-amsterdam.png",
      "price": "23NIS"
    }
  }}
  public static get EXTRAS_DETAILS(): Object { return {
    "cucumber": {
      "id": 1,
      "displayName": "Cucumber",
      "imgUrl": "../../assets/img/extras/cucumbers.jpg"
    },
    "tomatoes": {
      "id": 2,
      "displayName": "Tomatoes",
      "imgUrl": "../../assets/img/extras/tomatoes.jpeg"
    }
  }}
  public static get MEAT_DETAILS(): Object { return {
    "chicken" :  {
      "id": 1,
      "displayName": "Chicken",
      "imgUrl": "../../assets/img/meat/chicken.png"
    },
    "shwarma" : {
      "id": 2,
      "displayName": "Shwarma",
      "imgUrl": "../../assets/img/meat/shwarma.jpg"
    },
    "schnitzel" : {
      "id": 3,
      "displayName": "Schnitzel",
      "imgUrl": "../../assets/img/meat/schnitzel.jpg"
    },
  }}
}
