import React, { useRef } from "react";
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css";

interface IProps {
  setImage: (file: Blob) => void;
  imagePreview: string;
}

const PhotoWidgetCrpper: React.FC<IProps> = ({ setImage, imagePreview }) => {
  const cropper = useRef<Cropper>(null);

  const cropImage = () => {
    if (
      cropper.current &&
      typeof cropper.current.getCroppedCanvas() === "undefined"
    ) {
      return;
    }
    cropper &&
      cropper.current &&
      cropper.current.getCroppedCanvas().toBlob((blob: any) => {
        setImage(blob);
      }, "image/jpeg");
  };
  return (

   
    <Cropper    
      style={{ height: 200, width: "100%" }}
      preview = '.img-preview'    
      aspectRatio={1 / 1}
      guides={false}
      viewMode={1}
      dragMode="move"
      scalable={true}
      cropBoxMovable={true}
      cropBoxResizable={true}
      crop={cropImage}
      ref={cropper}
      src={imagePreview}
     
     
    />

  );
};

export default PhotoWidgetCrpper;
