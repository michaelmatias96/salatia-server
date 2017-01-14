/**
 * Created by michaelmatias on 1/6/17.
 */
export class AppSettings {
  public static get SUBMIT_ORDER_URL(): string { return this.SERVER + 'submitOrder/' }
  public static get GET_MENU_DETAILS(): string { return this.SERVER + 'menuDetails/' }
  public static get SERVER(): string { return 'http://localhost:4338/'; }
}
