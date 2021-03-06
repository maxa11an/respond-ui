import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../shared/services/menu.service';
import { MenuItemService } from '../shared/services/menu-item.service';
import { AppService } from '../shared/services/app.service';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
    selector: 'respond-menus',
    templateUrl: 'menus.component.html',
    providers: [MenuService, MenuItemService, AppService],
})

export class MenusComponent {

  id: string;
  role: string;
  menu;
  menus;
  items;
  errorMessage;
  selectedMenu;
  selectedItem;
  selectedIndex;
  addVisible: boolean;
  editVisible: boolean;
  removeVisible: boolean;
  addItemVisible: boolean;
  editItemVisible: boolean;
  removeItemVisible: boolean;
  drawerVisible: boolean;
  overflowVisible: boolean;

  options: SortablejsOptions = {
    handle: '.sortable-handle',
    onUpdate: () => this.updateOrder()
  };

  constructor (private _menuService: MenuService, private _menuItemService: MenuItemService, private _router: Router, private _appService: AppService) {}

  /**
   * Init
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('site_id');
    this.role = localStorage.getItem('site_role');
    this.addVisible = false;
    this.editVisible = false;
    this.removeVisible = false;
    this.addItemVisible = false;
    this.editItemVisible = false;
    this.removeItemVisible = false;
    this.drawerVisible = false;
    this.overflowVisible = false;
    this.menus = [];
    this.items = [];

    this.list('load');

  }

  /**
   * Updates the list
   */
  list(source:string) {

    if(source != 'load') {
      this._appService.showToast('success', null);
    }

    this.reset();

    this._menuService.list()
                     .subscribe(
                      (data: any) => { this.menus = data; this.success(); },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * handles the list successfully updated
   */
  success () {

    var x, flag = false;

    // check if selected menu is set
    if(this.menus.length > 0 && this.menus != undefined) {

      if(this.selectedMenu !== undefined && this.selectedMenu !== null) {
        for(x=0; x<this.menus.length; x++) {
          if(this.menus[x].id === this.selectedMenu.id) {
            flag = true;
          }
        }
      }

      // check if id is in array
      if(flag === false) {
        this.selectedMenu = this.menus[0];
      }

    }

    // update items
    if(this.selectedMenu !== null) {
      this.listItems();
    }

  }

  /**
   * list items in the menu
   */
  listItems() {

    this._menuItemService.list(this.selectedMenu.id)
                     .subscribe(
                      (data: any) => { this.items = data; },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Resets screen
   */
  reset() {
    this.addVisible = false;
    this.editVisible = false;
    this.removeVisible = false;
    this.addItemVisible = false;
    this.editItemVisible = false;
    this.removeItemVisible = false;
    this.drawerVisible = false;
    this.overflowVisible = false;
  }

  /**
   * Sets the menu to active
   *
   * @param {Menu} menu
   */
  setActive(menu) {
    this.selectedMenu = menu;

    this.listItems();
  }

  /**
   * Sets the list item to active
   *
   * @param {MenuItem} item
   */
  setItemActive(item) {
    this.selectedItem = item;
    this.selectedIndex = this.items.indexOf(item);
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Shows the overflow menu
   */
  toggleOverflow() {
    this.overflowVisible = !this.overflowVisible;
  }

  /**
   * Shows the add dialog
   */
  showAdd() {
    this.addVisible = true;
  }

  /**
   * Shows the edit dialog
   */
  showEdit() {
    this.editVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   * @param {menu} menu
   */
  showRemove(menu) {
    this.removeVisible = true;
    this.menu = menu;
  }

  /**
   * Shows the add dialog
   */
  showAddItem() {
    this.addItemVisible = true;
  }

  /**
   * Shows the edit dialog
   */
  showEditItem() {
    this.editItemVisible = true;
  }

  /**
   * Shows the remove dialog
   *
   * @param {menu} menu
   */
  showRemoveItem(menu) {
    this.removeItemVisible = true;
  }

  /**
   * Move the item up
   *
   * @param {item} menu
   */
  moveItemUp(item) {

    var i = this.items.indexOf(item);

    if(i != 0) {
      this.items.splice(i, 1);
      this.items.splice(i-1, 0, item);
    }

    this.updateOrder();

  }

  /**
   * Move the item down
   *
   * @param {item} menu
   */
  moveItemDown(item) {

    var i = this.items.indexOf(item);

    if(i != (this.items.length-1)) {
      this.items.splice(i, 1);
      this.items.splice(i+1, 0, item);
    }

    this.updateOrder();

  }

  /**
   * Updates the order of the menu items
   *
   */
  updateOrder() {

    this._menuItemService.updateOrder(this.selectedMenu.id, this.items)
                     .subscribe(
                      (data: any) => { this._appService.showToast('success', 'Order updated successfully'); },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * handles error
   */
  failure(obj) {

    this._appService.showToast('failure', obj.error);

    if(obj.status == 401) {
      this._router.navigate( ['/login'] );
    }

  }


}