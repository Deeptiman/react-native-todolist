import React, { Component } from 'react';
import { Dialog } from 'react-native-simple-dialogs';
import styles from '../../styles/calendar/CalendarStyles';
import SetupComponent from '../setup/SetupComponent';

export default class SyncCalendarDialog extends Component {

    constructor(props) {
        super(props)
        this.dismissSyncDialog = this.dismissSyncDialog.bind(this)
    }

    dismissSyncDialog() {
        this.props.closeSyncDialog(false)
    }

    render() {
    
        if(this.props.syncDone === true){
            this.props.closeSyncDialog(false)
        }

        return (
            <Dialog
                visible={this.props.syncDialogVisible}
                dialogStyle={styles.sync_calendar_dialog}
                onTouchOutside={() => this.props.closeSyncDialog(false)}
                keyboardShouldPersistTaps="never">
                <SetupComponent 
                dismissSyncDialog={this.dismissSyncDialog}/>                
            </Dialog>
        )
    }
}