'use strict';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AvatarEditor from 'react-avatar-editor';
import {setPath} from '../../utils/RamdaUtils';
import {IconRotateLeft, IconRotateRight, IconZoomIn, IconZoomOut} from '../../utils/Icons';
import {Dialog} from './../general';

class ProfilePictureDialog extends Component {

  state = {
    rotate: 0,
    zoom: 1,
    acceptAGB: false
  };

  constructor(props) {
    super(props);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleRequestSave = this.handleRequestSave.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.setAvatarEditorRef = this.setAvatarEditorRef.bind(this);
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
    this.setState(setPath(['errorText'], undefined, this.state));
    reader.readAsDataURL(file);
  }

  handleRequestSave = () => {
    const {file} = this.props.temp;
    if (!file) {
      this.setState(setPath(['errorText'], 'Bitte ein neues Bild auswählen', this.state));
      return;
    }
    const {acceptAGB} = this.state;
    if (!acceptAGB) {
      this.setState(setPath(['errorText'], 'Bitte die AGB akzeptieren', this.state));
      return;
    }

    const canvasScaled = this.editor.getImageScaledToCanvas();
    canvasScaled.toBlob(blob => {
      const formData = new FormData();
      formData.append('image', blob, file.name);
      this.props.onSave(formData);
      this.resetState();
    });
  };

  handleRequestClose = () => {
    this.resetState();
    this.props.onClose();
  };

  setAvatarEditorRef = (editor) => {
    this.editor = editor;
  };

  resetState = () => {
    this.setState({acceptAGB: false, rotate: 0, errorText: undefined});
  };

  rotateLeft = () => {
    this.setState(setPath(['rotate'], this.state.rotate - 90, this.state));
  };

  rotateRight = () => {
    this.setState(setPath(['rotate'], this.state.rotate + 90, this.state));
  };

  zoomIn = () => {
    this.setState(setPath(['zoom'], this.state.zoom + 0.1, this.state));
  };

  zoomOut = () => {
    this.setState(setPath(['zoom'], this.state.zoom - 0.1, this.state));
  };

  onCheckboxChange = event => {
    this.setState({acceptAGB: event.target.checked, errorText: undefined});
  };

  render() {
    const {acceptAGB, rotate, zoom, errorText} = this.state;
    const {show, temp} = this.props;

    return (
      <Dialog
        title='Profilbild anpassen'
        onClose={this.handleRequestClose}
        open={show}>
          <DialogContent>
            <div style={{margin: '24px auto', width: '250px', height: '250px'}}>
              <AvatarEditor
                ref={this.setAvatarEditorRef}
                image={temp.dataUrl}
                width={200}
                height={200}
                border={25}
                color={[200, 200, 200, 0.75]}
                scale={zoom}
                rotate={rotate}
              />
            </div>
            <div style={{margin: '16px auto', textAlign: 'center'}}>
              <div>
                <IconButton onClick={this.zoomIn}>
                  <IconZoomIn/>
                </IconButton>
                <IconButton onClick={this.zoomOut}>
                  <IconZoomOut/>
                </IconButton>
                <IconButton onClick={this.rotateRight}>
                  <IconRotateRight/>
                </IconButton>
                <IconButton onClick={this.rotateLeft}>
                  <IconRotateLeft/>
                </IconButton>
              </div>
              <Button variant='raised' color='primary'>
                <input
                  type={'file'}
                  accept={'image/*'}
                  name={'image'}
                  style={{position: 'absolute', width: '100%', opacity: '0'}}
                  onChange={this.handleUpload}
                />
                Ein anderes Bild wählen
              </Button>
            </div>
            <div>
              <Typography>Wähle einen Bildausschnitt für Dein neues Profilbild
                und klicke anschließend auf Speichern.
                Mit dem Speichern bestätigst Du, dass Du die Rechte an diesem Bild besitzt
                und es nicht gegen unsere AGB verstößt.
              </Typography>
              <FormControl required error={!!errorText}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id='acceptAGB'
                      checked={acceptAGB}
                      onChange={this.onCheckboxChange}
                    />
                  }
                  label={'ich stimme zu'}
                />
                <FormHelperText>{errorText}</FormHelperText>
              </FormControl>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRequestSave} color="primary">Speichern</Button>
            <Button onClick={this.handleRequestClose}>Abbrechen</Button>
          </DialogActions>
      </Dialog>
    );
  };
}

export default ProfilePictureDialog;