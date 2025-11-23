import React, { useState, useEffect } from "react";
import {
  Popover,
  TextField,
  ColorPicker,
  hsbToHex,
  hexToRgb,
  rgbToHsb,
  HSBColor,
} from "@shopify/polaris";
import '../assets/custom.css'

type CustomColorPickerProps = {
  colour?: string;
  element: string;
  changeColor: (color: string, element: string) => void;
  label?: string;
  labelHidden?: boolean;
  width?: string;
};

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  colour,
  element,
  changeColor,
  label,
  labelHidden = false,
  width,
}) => {
  const defaultHex = "#FFFFFF";
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const [boxColour, setBoxColour] = useState<HSBColor>({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });
  const [boxHexColour, setBoxHexColour] = useState<string>(defaultHex);


  const toggleColorPicker = () => {
    setColorPickerActive(!colorPickerActive);
  };

  const handleColorChange = (newColor: HSBColor) => {
    let hexColor = hsbToHex(newColor).toUpperCase();
    setBoxHexColour(hexColor);
    setBoxColour(newColor);
    changeColor(hexColor, element);
  };

  const handleColorChangeFromInput = (newColor: string) => {
    if (newColor.length > 7) return;
    if (!newColor) newColor = defaultHex;

    if (newColor[0] !== "#") newColor = "#" + newColor.substr(1);
    if ((newColor.match(/#/g) || []).length > 1) newColor = defaultHex;

    newColor = newColor.toUpperCase();
    const rgbColor = hexToRgb(newColor);
    const hsbColor = rgbToHsb(rgbColor);
    setBoxHexColour(newColor);
    setBoxColour(hsbColor);
    changeColor(newColor, element);
  };

  useEffect(() => {
    if (!colour) {
      setBoxHexColour(boxHexColour);
      setBoxColour(boxColour);
      return;
    }

    setBoxHexColour(colour);
    const rgbColor = hexToRgb(colour);
    const hsbColor = rgbToHsb(rgbColor);
    setBoxColour(hsbColor);
  }, [colour]);

  const colorPickerActivator = (
    <div
      onClick={toggleColorPicker}
      style={{
        backgroundColor: boxHexColour,
        width: "22px",
        height: "22px",
        cursor: "pointer",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    />
  );

  return (
    <div className={`relative ${width ? width : "w-full"}`}>
      <div className="paddingLeftTextField">
        <TextField
          type="text"
          autoComplete="off"
          labelHidden={labelHidden}
          label={label}
          value={boxHexColour}
          onChange={handleColorChangeFromInput}
        />
      </div>
      <div style={{ position: "absolute", left: "21px", bottom: "21px", zIndex: 99 }}>
        <Popover active={colorPickerActive} activator={colorPickerActivator} onClose={toggleColorPicker}>
          <Popover.Pane>
            <ColorPicker onChange={handleColorChange} color={boxColour} />
          </Popover.Pane>
        </Popover>
      </div>
    </div>
  );
}

export default CustomColorPicker;