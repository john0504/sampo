import {
    Component,
    forwardRef,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
    ComponentModel,
    ControlItemModel,
    InformationModelService,
    RangeLogic,
    RangeLogicState,
    UIOptions,
    UIComponentBase,
    ValueItem
} from '../../../modules/information-model';

@Component({
  selector: 'custom-range',
  templateUrl: 'custom-range.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomRange), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class CustomRange extends UIComponentBase {
  title: string = '';
  logic: RangeLogic;
  state: RangeLogicState;

  constructor(
    ims: InformationModelService,
  ) {
    super(ims, 'custom-range', null);
    this.logic = new RangeLogic(ims, this.exoChange);
    this.state = this.logic.state;
  }

  protected processLayout(model: ComponentModel, values: Array<ValueItem> | UIOptions, key: string, index: number, unitModel: ControlItemModel, range?: any) {
    if (!values || !model || !unitModel || index !== 0) return;

    this.title = model.title;
    this.state = this.logic.processLayout(values, key, unitModel);
  }

  protected processUIState(currentValueState: any, key: string, index: number, model: ControlItemModel) {
    if (!key || index !== 0) return;
    this.state = this.logic.processUIState(currentValueState, key, model);
  }

  protected processDisableState(disableState, key: string, index: number, model: ControlItemModel) {
    if (index !== 0) return;
    this.state = this.logic.processDisableState(disableState, key, model);
  }

  sendValue({ value: index }) {
    if (this.model) {
      this.state = this.logic.sendValue(index);
    }
  }

  valueChanges({ value: index }) {
    this.state = this.logic.valueChanges(index);
  }
}
