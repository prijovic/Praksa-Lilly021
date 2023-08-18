import React, {useState} from "react";
import {AuthMode} from "./AuthMode";
import {Alert, AlertColor, Button, Card, CardActions, CardContent, CardHeader, Snackbar, Stack} from "@mui/material";
import {InputField} from "../UI/InputField";
import {PasswordInput} from "../UI/PasswordInput";
import {CustomDatePicker} from "../UI/CustomDatePicker";
import {toTitleCase} from "../../utils/toTitleCase";
import {AddressInput} from "../UI/AddressInput";
import {Address} from "../../model/entities/Address";
import {Moment} from "moment";
import {sendSignUpRequest} from "../../http/auth";

export enum AuthInputs {
    EMAIL,
    PASSWORD,
    NAME,
    SURNAME,
    FARM_NAME,
    ADDRESS
}

interface AuthFormProps {
    mode: AuthMode
}

export const AuthForm: React.FC<AuthFormProps> = ({mode}) => {
    const emailValidator = {
        "Invalid E-mail format": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };
    const [email, setEmail] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(false);

    const passwordValidator = {
        "Password must have at least 12 character, 1 lower case letter, 1 upper case letter, 1 number and 1 special character":
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
    };
    const [password, setPassword] = useState('');
    const [passwordIsValid, setPasswordIsValid] = useState(false);

    const [name, setName] = useState('');
    const nameValidator = (label: string) => {
        return {
            [`${label} can only contain as least 2 character and spaces`]: /^(?=.*[a-zA-Z])[a-zA-Z\s]{2,}$/
        }
    };
    const [nameIsValid, setNameIsValid] = useState(false);

    const [surname, setSurname] = useState('');
    const [surnameIsValid, setSurnameIsValid] = useState(false);

    const [birthDate, setBirthDate] = useState<Moment | null>(null);
    const [birthDateIsValid, setBirthDateIsValid] = useState(false);

    const [address, setAddress] = useState<Address | null>(null);
    const [addressIsValid, setAddressIsValid] = useState(false);

    const [farmName, setFarmName] = useState('');
    const [farmNameIsValid, setFarmNameIsValid] = useState(false);

    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<AlertColor | null>(null);

    const formIsValid: boolean = (mode === AuthMode.LOGIN) ? emailIsValid && passwordIsValid :
        emailIsValid && passwordIsValid && nameIsValid && surnameIsValid && birthDateIsValid && !!birthDate && addressIsValid && !!address && farmNameIsValid;

    const changeHandler = (inputType: AuthInputs) => {
        let methodToExecute: (value: any) => void;
        switch (inputType) {
            case AuthInputs.EMAIL:
                methodToExecute = setEmail;
                break;
            case AuthInputs.PASSWORD:
                methodToExecute = setPassword;
                break;
            case AuthInputs.NAME:
                methodToExecute = setName;
                break;
            case AuthInputs.SURNAME:
                methodToExecute = setSurname;
                break;
            case AuthInputs.ADDRESS:
                methodToExecute = setAddress;
                break;
            default:
                methodToExecute = setFarmName;
                break;
        }
        return (value: any) => methodToExecute(value)
    }

    const validityHandler = (inputType: AuthInputs) => {
        let methodToExecute: (value: boolean) => void;
        switch (inputType) {
            case AuthInputs.EMAIL:
                methodToExecute = setEmailIsValid;
                break;
            case AuthInputs.PASSWORD:
                methodToExecute = setPasswordIsValid;
                break;
            case AuthInputs.NAME:
                methodToExecute = setNameIsValid;
                break;
            case AuthInputs.SURNAME:
                methodToExecute = setSurnameIsValid;
                break;
            case AuthInputs.ADDRESS:
                methodToExecute = setAddressIsValid;
                break;
            default:
                methodToExecute = setFarmNameIsValid;
                break;
        }
        return (value: boolean) => methodToExecute(value)
    }

    const handleFormSubmit: React.FormEventHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formIsValid) {
            if (mode === AuthMode.LOGIN) {

            } else if (mode === AuthMode.SIGN_UP) {
                sendSignUpRequest({
                    email,
                    password,
                    name,
                    surname,
                    birthDate: birthDate!.toDate(),
                    address: address!,
                    farmName
                })
                    .then(() => {
                        setNotificationMessage("Successful sign up!")
                        setNotificationType("success");
                    })
                    .catch((res) => {
                        setNotificationMessage(res.response.data.error);
                        setNotificationType("error");
                    })
            }
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotificationMessage(null);
    };

    return (
        <>
            <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={!!notificationMessage}
                      autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={notificationType!}
                       sx={{width: '100%'}}>
                    {notificationMessage}
                </Alert>
            </Snackbar>
            <Card className={"form"} sx={{maxWidth: {xs: "80%", sm: "500px"},}}>
                <CardHeader
                    title={toTitleCase(mode)}
                    titleTypographyProps={{component: "h1", variant: "h4"}}
                    subheader={`Please fill out your information to ${mode}.`}
                    subheaderTypographyProps={{component: "p", variant: "subtitle1", gutterBottom: true}}
                />
                <form onSubmit={handleFormSubmit}>
                    <CardContent>
                        <Stack spacing={6}>
                            <Stack spacing={2} direction={'column'}>
                                <InputField label={"E-mail"} type={"email"} id={"email"} value={email}
                                            onChange={changeHandler(AuthInputs.EMAIL)} required={true}
                                            onValidityChange={validityHandler(AuthInputs.EMAIL)}
                                            validators={emailValidator}/>
                                <PasswordInput label={"Password"} id={"password"} value={password}
                                               onChange={changeHandler(AuthInputs.PASSWORD)} required={true}
                                               onValidityChange={validityHandler(AuthInputs.PASSWORD)}
                                               validators={passwordValidator}/>
                            </Stack>
                            {mode === AuthMode.SIGN_UP && <>
                              <Stack spacing={2} direction={'column'}>
                                <InputField label={"Name"} type={"text"} id={"name"} value={name}
                                            onChange={changeHandler(AuthInputs.NAME)} required={true}
                                            onValidityChange={validityHandler(AuthInputs.NAME)}
                                            validators={nameValidator('Name')}/>
                                <InputField label={"Surname"} type={"text"} id={"surname"} value={surname}
                                            onChange={changeHandler(AuthInputs.SURNAME)} required={true}
                                            onValidityChange={validityHandler(AuthInputs.SURNAME)}
                                            validators={nameValidator('Surname')}/>
                                <CustomDatePicker label={"Birthday"} value={birthDate}
                                                  onValidityChange={(value: boolean) => setBirthDateIsValid(value)}
                                                  onChange={(value: any) => (setBirthDate(value))}/>
                                <AddressInput id={"address"} label={"Address"}
                                              value={address}
                                              onChange={changeHandler(AuthInputs.ADDRESS)}
                                              onValidityChange={(value: boolean) => setAddressIsValid(value)}/>
                              </Stack>
                              <Stack spacing={2} direction={'column'}>
                                <InputField label={"Farm Name"} type={"text"} id={"farmName"} value={farmName}
                                            onChange={changeHandler(AuthInputs.FARM_NAME)} required={true}
                                            onValidityChange={validityHandler(AuthInputs.FARM_NAME)}
                                            validators={nameValidator('Farm name')}/>
                              </Stack>
                            </>}
                        </Stack>
                    </CardContent>
                    <CardActions style={{justifyContent: "center", marginTop: "16px"}}>
                        <Button size={"large"} type="submit" sx={{width: {xs: "100%", sm: "fit-content"}}}
                                variant={"contained"}>{mode}</Button>
                    </CardActions>
                </form>
            </Card>
        </>
    );
};
