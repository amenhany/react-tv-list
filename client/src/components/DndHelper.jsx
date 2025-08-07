import {
  MouseSensor as LibMouseSensor,
  KeyboardSensor as LibKeyboardSensor,
  TouchSensor as LibTouchSensor
} from '@dnd-kit/core'

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown',
      handler: ({ nativeEvent: event }) => {
        return shouldHandleEvent(event.target);
      }
    }
  ]
}

export class KeyboardSensor extends LibKeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown',
      handler: ({ nativeEvent: event }) => {
        return shouldHandleEvent(event.target);
      }
    }
  ]
}

export class TouchSensor extends LibTouchSensor {
  constructor(props) {
    super({
      ...props,
      activationConstraint: {
        tolerance: 8
      }
    })
  }

  static activators = [
    {
      eventName: 'onTouchStart',
      handler: ({ nativeEvent: event }) => {
        return shouldHandleEvent(event.target);
      }
    }
  ]
}

function shouldHandleEvent(element) {
  let cur = element

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}