import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { 
  StateStore, 
  AppTasks,
  Account, 
} from 'app-engine';
import { 
  NavController,
  ViewController, 
  AlertOptions, 
  AlertController,
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { debounceImmediate } from '../../app/app.extends';
import { DeviceCore } from '../../item-models/device/device-core';
import { DeviceCoreInjector } from '../../item-models/device/device-core-injector';

import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'list-device-item',
  templateUrl: 'list-device-item.html'
})
export class ListDeviceItemComponent implements OnInit, OnDestroy {
  private subs: Array<Subscription>;
  private devices$: Observable<any>;
  private account$: Observable<any>;

  _deviceSn: any;
  deviceCore: DeviceCore;
  isValidDevice: Boolean = false;
  isOwner: boolean = false;
  account: Account;

  constructor(
    private dcInjector: DeviceCoreInjector,
    private navCtrl: NavController,
    private stateStore: StateStore,
    public viewCtrl: ViewController,
    private translate: TranslateService,
    private appTasks: AppTasks,
    private alertCtrl: AlertController,
  ) {
    this.subs = [];
    this.devices$ = this.stateStore.devices$;
    this.deviceCore = this.dcInjector.create();
    this.account$ = this.stateStore.account$;
  }

  @Input()
  get deviceSn(): any {
    return this._deviceSn;
  }

  set deviceSn(val: any) {
    this._deviceSn = val;
    this.account$.pipe(first()).subscribe(account => this.account = account);
  }

  @HostListener('window:model-loaded', ['$event'])
  reload(event) {
    this.deviceCore && this.deviceCore.selfUpdate();
  }

  ngOnInit() {
    this.subs.push(
      this.devices$
        .pipe(debounceImmediate(500))
        .subscribe(devices => this.processValues(devices))
    );
  }

  ngOnDestroy() {
    this.subs && this.subs.forEach((s) => {
        s.unsubscribe();
      });
    this.subs.length = 0;
  }

  private processValues(devices) {
    this.isValidDevice = this.validateDevices(devices);
    if (this.isValidDevice) {
      const device = devices[this._deviceSn];

      this.deviceCore = this.dcInjector.bind(this.deviceCore, device);
      this.deviceCore.selfUpdate();
    }
  }

  private validateDevices(devices) {
    return this._deviceSn && devices && devices[this._deviceSn];
  }

  goDeviceDetailPage() {
    this.navCtrl.push('DeviceDetailPage', { deviceSn: this._deviceSn });
  }

  delete() {
    const alertTitle = this.translate.instant('DEVICE_SETTINGS.DELETE_ALERT_TITLE', { deviceName: this.deviceCore.deviceName });
    const alertCancel = this.translate.instant('DEVICE_SETTINGS.CANCEL');
    const alertDelete = this.translate.instant('DEVICE_SETTINGS.DELETE');

    let options: AlertOptions = {
      title: alertTitle,
      buttons: [
        {
          text: alertCancel,
          role: 'cancel',
        },
        {
          text: alertDelete,
          handler: () => {
            this.appTasks.wsRequestDeleteDeviceTask(this.deviceSn);
          },
        }
      ],
    };    
    this.isOwner = this.deviceCore.isOwner(this.account.account);
    if (!this.isOwner) {
      const guestMsg = this.translate.instant('DEVICE_SETTINGS.GUEST_DELETE_MSG');
      options.message = guestMsg;
    }
    const alert = this.alertCtrl.create(options);
    alert.present();
  }
}
