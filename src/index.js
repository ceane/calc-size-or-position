/* @flow */
export const CSSChUnit = Symbol("ch");
export const CSSEmUnit = Symbol("em");
export const CSSPixelUnit = Symbol("px");
export const CSSPercentageUnit = Symbol("%");
export const CSSRemUnit = Symbol("rem");
export const CSSPointUnit = Symbol("pt");
export const CSSVwUnit = Symbol("vw");
export const CSSVhUnit = Symbol("vh");
export const CSSVminUnit = Symbol("vmin");
export const CSSVmaxUnit = Symbol("vmax");
export const CSSZeroValue = Symbol("0");
export const CSSInheritValue = Symbol("inherit");
export const CSSAutoValue = Symbol("auto");
export const CSSNonStandardAutoValue = Symbol("?auto");
export const CSSCoverValue = Symbol("cover");
export const CSSContainValue = Symbol("cover");
export const CSSBottomValue = Symbol("bottom");
export const CSSCenterValue = Symbol("center");
export const CSSLeftValue = Symbol("left");
export const CSSRightValue = Symbol("right");
export const CSSTopValue = Symbol("top");

type CSSValueOrUnit =
  CSSChUnit |
  CSSEmUnit |
  CSSPixelUnit |
  CSSPercentageUnit |
  CSSRemUnit |
  CSSPointUnit |
  CSSVwUnit |
  CSSVhUnit |
  CSSVminUnit |
  CSSVmaxUnit |
  CSSZeroValue |
  CSSInheritValue |
  CSSAutoValue |
  CSSNonStandardAutoValue |
  CSSCoverValue |
  CSSContainValue |
  CSSBottomValue |
  CSSCenterValue |
  CSSLeftValue |
  CSSRightValue |
  CSSTopValue;

type SizeOrPositionValue = {
  value: ?number;
  unit: CSSValueOrUnit;
}

type Size = {
  width: number;
  height: number;
}

type Position = {
  x: number;
  y: number;
}

type SizeOrPosition = Size | Position;

type Element = {
  width: number;
  height: number;
  fontSize: ?number;
}

export const startPosition = {
  x: 0,
  y: 0
};

export const startSize = {
  width: 0,
  height: 0
};

export const makeSize = (width, height) => ({
  width,
  height
});

export const makePosition = (x, y) => ({
  x,
  y
});

const reverse = (condition, a) => condition ? a.reverse() : a;
const reverseAuto = (a, b) => a.unit !== CSSAutoValue ? -1 : 0;

/**
 * Calculates new size or position
 */
export default function calcSizeOrPosition(
  newSizeOrPosition, 
  child, 
  parent) {

  if (newSizeOrPosition.length === 1 && 
    newSizeOrPosition[0].unit === CSSZeroValue) {
    return [0, 0];
  }

  var innerWidth = window.innerWidth;
  var innerHeight = window.innerHeight;
  var fontSize = 16;
  var vmin = innerWidth > innerHeight ? innerHeight : innerWidth;
  var vmax = innerWidth > innerHeight ? innerWidth : innerHeight;
  
  const widthKey = "width";
  const heightKey = "height";
  const { [widthKey]: cw, [heightKey]: ch } = child;
  const { [widthKey]: pw, [heightKey]: ph } = parent;

  var childAspectRatio = !(cw / ch) ? 1 : cw / ch;
  var parentAspectRatio = !(pw / ph) ? 1 : pw / ph;
  
  var isReversed = newSizeOrPosition[0].unit === CSSAutoValue;
  let finalPositionOrSize = newSizeOrPosition.sort(reverseAuto);


  for (var i = 0, len = finalPositionOrSize.length; i < len; i++) {
    var item = finalPositionOrSize[i];

    var axis = isReversed ? i > 1 : i < 1;
    var childAxisLength = axis ? cw : ch;
    var parentAxisLength = axis ? pw : ph;
    var parentOppositeAxisLen = axis ? ph : pw;


    switch (item.unit) {
      case CSSPixelUnit:
        finalPositionOrSize[i] = item.value;
        break;
      case CSSPercentageUnit:
        finalPositionOrSize[i] = item.value / 100 * parentAxisLength;
        break;
      case CSSVwUnit:
        finalPositionOrSize[i] = item.value / 100 * innerWidth;
        break;
      case CSSVhUnit:
        finalPositionOrSize[i] = item.value / 100 * innerHeight;
        break;
      case CSSVminUnit:
        finalPositionOrSize[i] = item.value / 100 * vmin;
        break;
      case CSSVmaxUnit:
        finalPositionOrSize[i] = item.value / 100 * vmax;
        break;
      case CSSEmUnit:
        finalPositionOrSize[i] = item.value * fontSize * 0.75;
        break;
      case CSSAutoValue:
        finalPositionOrSize[i] = finalPositionOrSize[0] / childAspectRatio;
        break;
      case CSSNonStandardAutoValue:
        finalPositionOrSize[i] = parentOppositeAxisLen / childAspectRatio;
        break;
      case CSSInheritValue:
        finalPositionOrSize[i] = parentAxisLength;
        break;
      case CSSContainValue:
        return (childAspectRatio >= parentAspectRatio ?
          [pw, pw / childAspectRatio] : [ph * childAspectRatio, ph]
        );
      case CSSCoverValue:
        return (childAspectRatio <= parentAspectRatio ?
          [pw, pw / childAspectRatio] : [ph * childAspectRatio, ph]
        );
      case CSSCenterValue:
        finalPositionOrSize[i] = (parentAxisLength - childAxisLength) / 2;
        break;
      case CSSRightValue:
      case CSSBottomValue:
        finalPositionOrSize[i] = parentAxisLength - childAxisLength;
        break;
      case CSSZeroValue:
      case CSSLeftValue:
      case CSSTopValue:
        finalPositionOrSize[i] = 0;
        break;
    }
  }

  return reverse(isReversed, finalPositionOrSize);
}

const unzero = a => a === 0 ? 1 : a;

export const getResizedRatio = (oldSize, newSize) => {
  var a = oldSize.map(unzero);
  return [newSize[0] / a[0], newSize[1] / a[1]];
}

export const recalculatePoint = (point, resizedRatio) => {
  var newPoint = [].concat(point);
  return newPoint.map((p, i) => p * resizedRatio[i]);
}
