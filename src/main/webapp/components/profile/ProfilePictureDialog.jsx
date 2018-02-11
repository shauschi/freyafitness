'use strict';
import React, {Component} from 'react';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import {FormGroup, FormControlLabel} from "material-ui/Form";
import Dialog, {
  DialogContent,
  DialogActions,
  DialogTitle,
  withMobileDialog
} from 'material-ui/Dialog';
import AvatarEditor from 'react-avatar-editor';
import Slide from 'material-ui/transitions/Slide';

import {FaClose} from 'react-icons/lib/fa';
import {blueGrey} from 'material-ui/colors';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ProfilePictureDialog extends Component {

  constructor(props) {
    super(props);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload(e) {
    const {changeTempProfilePicture} = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = (e) => {
      const temp = {
        file: file,
        dataUrl: e.target.result
      };
      changeTempProfilePicture(temp);
    };
    reader.readAsDataURL(file);
  }

  handleRequestSave = () => {
    const {file} = this.props.temp;
    const canvasScaled = this.editor.getImageScaledToCanvas();
    canvasScaled.toBlob(blob => {
      console.warn("its a blob", blob);
      const formData = new FormData();
      formData.append('image', blob, file.name);
      this.props.onSave(formData);
    });
  };

  handleRequestClose = () => {
    this.props.onClose();
  };

  setAvatarEditorRef = (editor) => {
    this.editor = editor;
  };

  render() {
    const {show, fullScreen, temp} = this.props;

    return (
      <Dialog
        onClose={this.handleRequestClose}
        fullScreen={fullScreen}
        transition={Transition}
        open={show}>

          <DialogTitle disableTypography
                       style={{color: 'white', background: blueGrey.A700, display: 'flex', padding: '2px 16px'}}>
            <IconButton style={{color: 'white'}} onClick={this.handleRequestClose} aria-label="Close">
              <FaClose/>
            </IconButton>
            <Typography type="title" style={{color: 'white', flex: 1, textAlign: 'center', padding: '14px 0'}}>
              Profilbild anpassen
            </Typography>
          </DialogTitle>

          <DialogContent>
            <div style={{margin: '24px auto', width: '250px', height: '250px'}}>
              <AvatarEditor
                ref={this.setAvatarEditorRef}
                image={temp.dataUrl}
                width={200}
                height={200}
                border={25}
                color={[200, 200, 200, 0.75]}
                scale={1.5}
                rotate={0}
              />
            </div>
            <div style={{margin: '16px auto', textAlign: 'center'}}>
              <Button raised color="primary">
                <input
                  type={'file'}
                  name={'image'}
                  style={{position: 'absolute', width: '100%', opacity: '0'}}
                  onChange={this.handleUpload}
                />
                Ein anderes Bild wählen
              </Button>
            </div>
            {/* TODO nach Login with Facebook
            <div style={{margin: '16px auto', textAlign: 'center'}}>
              <Button raised>Mein facebook Profilbild nehmen</Button>
            </div>
            */}
            <div>
              <Typography>Wähle einen Bildausschnitt für Dein neues Profilbild
                und klicke anschließend auf Speichern.
                Mit dem Speichern bestätigst Du, dass Du die Rechte an diesem Bild besitzt
                und es nicht gegen unsere AGB verstößt.
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      id='acceptAGB'
                      checked={true}
                      onChange={() => {}}
                    />
                  }
                  label={'ich stimme zu'}
                />
              </FormGroup>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRequestSave} color="primary">Speichern</Button>
            <Button onClick={this.handleRequestClose} color="primary">Abbrechen</Button>
          </DialogActions>
      </Dialog>
    );
  };
}

export default withMobileDialog()(ProfilePictureDialog);