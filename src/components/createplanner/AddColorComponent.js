import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import styles from '../../styles/createplanner/CreatePlannerStyles';
import {Utils} from '../utils/Utils';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

export default class AddColorComponent extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        let colors = Utils.getColors(this.props.loginType)
        
        return (
            <Dialog
                visible={this.props.isVisible}
                dialogStyle={styles.add_color_dialog}
                onTouchOutside={() => this.props.closeColorDialog(false)}
                keyboardShouldPersistTaps="never">
                <ScrollView style={styles.add_color_view} showsVerticalScrollIndicator={false}>

                    <RadioForm
                        style={styles.color_radio_button_view}
                        formHorizontal={false}
                        animation={true}>
                        {
                            colors.map((obj, i) => (
                                <RadioButton labelHorizontal={true} key={i} style={{ padding: 10 }} >
                                    <RadioButtonInput
                                        obj={obj}
                                        index={i}
                                        borderWidth={2}
                                        isSelected={this.props.currentColor.id == i + 1}
                                        buttonInnerColor={obj.color}
                                        buttonOuterColor={obj.color}
                                        buttonSize={16}
                                        buttonOuterSize={18}
                                        buttonStyle={{}}
                                        onPress={(value) => { this.props.chooseColor(obj) }}
                                        buttonWrapStyle={{ marginLeft: 5 }}
                                    />
                                    <RadioButtonLabel
                                        obj={obj}
                                        index={i}
                                        onPress={(value) => { this.props.chooseColor(obj) }}
                                        labelHorizontal={true}
                                        labelStyle={{
                                            width: '100%',
                                            fontFamily: this.props.currentColor.id == i + 1 ? 'Roboto-Medium' : 'Roboto-Regular',
                                            fontSize: 14,
                                            color: this.props.currentColor.id == i + 1 ? '#0000a0' : '#000',
                                            marginLeft: 5
                                        }}
                                        labelWrapStyle={{}}
                                    />
                                </RadioButton>
                            ))
                        }
                    </RadioForm>
                </ScrollView>
            </Dialog>
        )
    }
}