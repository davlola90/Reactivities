import React, { Fragment, useState, useEffect } from "react";
import { Header, Grid, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import PhotoWidgetDropZone from "./PhotoWidgetDropZone";
import PhotoWidgetCrpper from "./PhotoWidgetCrpper";

interface IProps {
  uploadingPhoto: boolean;
  handleUploadImage: (file: Blob) => void;
}
const PhotoUploadWidget: React.FC<IProps> = ({
  uploadingPhoto,
  handleUploadImage
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <PhotoWidgetDropZone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files.length > 0 && (
            <PhotoWidgetCrpper
              setImage={setImage}
              imagePreview={files[0].preview}
            />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {files.length > 0 && (
            <Fragment>
              <div
                className="img-preview"
                style={{ minHeight: "200px", overflow: "hidden" }}
              />
              <Button.Group widths={2}>
                <Button positive icon='check' loading={uploadingPhoto} onClick={()=>handleUploadImage(image!)}/>
                <Button  icon='close' disabled={uploadingPhoto} onClick={()=>setFiles([])}/>
                
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default observer(PhotoUploadWidget);
