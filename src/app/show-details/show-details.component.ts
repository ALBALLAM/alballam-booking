import { Component, OnInit } from "@angular/core";
import { StorageService } from "../services/storage/storage.service";
import { UtilitiesService } from "../services/utilities.service";
import { IShow } from "../components/show/show.interface";
import { TranslateService } from "@ngx-translate/core";
import { DialogComponent } from "../components/dialog/dialog.component";
import { CommunicationService } from "../services/communication/communication.service";
import { MatDialog } from "@angular/material";
import { ShowDetailsService } from "./show-details.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { variables } from "../app.variables";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import * as moment from "moment-timezone";
import { HostListener } from "@angular/core";
import { Subscription } from "rxjs";

// export const termsValidation: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
//   const formValues = control.value;
//   if (formValues.covidTerms === true) {
//     control.get('covidTerms').setErrors(null);
//   } else {
//     control.get('covidTerms').setErrors({required: true});
//   }
//   return null;
// };

@Component({
  selector: "app-show-details",
  templateUrl: "./show-details.component.html",
  styleUrls: ["./show-details.component.scss"],
})
export class ShowDetailsComponent implements OnInit {
  public show: IShow;
  public currentLang;
  public direction;
  public selectedDateIndex = "";
  public times = [];
  public selectedTimeIndex = "";
  public selectedZoneIndex;
  public zonesResponse;
  public seatingsResponse;
  public bookSeatingsResponse;
  public translation;
  public showDetails = false;
  public showZones: boolean;
  public showPaymentMethods: boolean;
  public showSeatings: boolean;
  public selectSeatsObj;
  public chosenPlay;
  public chosenZone;
  public seatmap = [];
  public disableLeaveOneSeatsEmpty = false;
  public routeVariables = variables.routes;
  public form: FormGroup;
  public chosenPackage;
  public finishPayment;
  public previousUrl;
  public currentUrl;
  public showComponentStep;
  private _routeSubscription: Subscription;
  config;
  selectedZone;
  selectedSeatsQR:{}[]=[];
  constructor(
    private _router: Router,
    private _translationService: TranslateService,
    private _utilitiesService: UtilitiesService,
    private _translate: TranslateService,
    private _communicationService: CommunicationService,
    private _dialog: MatDialog,
    private _showDetailsService: ShowDetailsService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute
  ) {

    this._translate.getTranslation(this._translate.currentLang).subscribe(
      (translation) => (this.translation = translation),
      () => null,
      () => {
        this._utilitiesService.setPageTitle(this.translation.TOP_BAR.SHOW);
      }
    );
  }

  public ngOnInit() {
    this._routeSubscription = this._route.params.subscribe((params) => {
      this.currentLang = this._translate.currentLang;
      this.direction = this.currentLang === "ar" ? "rtl" : "ltr";
      switch (params.screen) {
        case "details":
          this.initializeShowDetails();
          break;
        case "zones":
          this.times = StorageService.getItem("times");
          this.selectedTimeIndex = StorageService.getItem("selectedTimeIndex");
          this.selectedZoneIndex =
            StorageService.getItem("selectedZoneIndex") || 0;
          this.bookPlayInitialization();
          break;
        case "tickets":
          this.zonesResponse = StorageService.getItem("zonesResponse");
          this.selectedZoneIndex = StorageService.getItem("selectedZoneIndex");
          this.chosenPlay = StorageService.getItem("chosenPlay");
          this.ticketsInitialization();
          break;
        case "payment":
          this.initilizePaymentPage();
          break;
        default:
          this._utilitiesService.routeToLanding();
          break;
      }
    });
  }

  public selectDate(index) {
    this.selectedDateIndex = index;
    this.times = this.show.dates[index].plays;
    // this.selectedTimeIndex = 0;
  }

  public selectTime(index) {
    this.selectedTimeIndex = index;
  }

  public selectZone(zone,index) {
    console.log(zone)
    this.selectedZone=zone
    this.config = {
      region: "eu",
      // e.g. "eu"
      workspaceKey: "440aa06c-6e19-42b7-9288-e39313088016",
      // workspaceKey: "fc280027-959e-4d95-ac37-da974a11e9fb",

      event: "dd190aa3-818c-41df-a365-74043e4406aa",
      onRenderStarted: (chart) => {
        console.info("Render Started");
      },
      availableCategories:[this.selectedZone.label],
      onObjectSelected:(object,selectedTickets)=>{
        let selectedSeat = {
          price:this.selectedZone.price,
          row:object.labels.section,
          seat:object.labels.own

        }
        console.log(selectedSeat)
        this.selectedSeatsQR.push(selectedSeat);
        if(this.selectSeatsObj == null)
         this.selectSeatsObj = {seatsforDisplay:[]}
        this.selectSeatsObj.seatsforDisplay = this.selectedSeatsQR;
        console.log(object,'test',selectedTickets)

      },

      // categories: [
      //   {
      //     key: "red",
      //     color: "red",
      //     label: "Category 1",
      //     channel:{
      //       "name": "VIP",
      //       "key": "red",
      //       "color": "#E9B64D",
      //       "index": 3
      //     }
      //   },
      //   {
      //     key: "blue",
      //     color: "blue",
      //     label: "Category 2",

      //   },
      // ],
    };
    this.selectedZoneIndex = index;
  }

  public choosePackage(record) {
    this.chosenPackage = record;
  }

  public chooseSeating(event) {
    this.selectSeatsObj = event;
    console.log(this.selectSeatsObj,"this.selectSeatsObj")
  }

  //INITIALIZE STEP ONE
  public initializeShowDetails() {
    this.show = StorageService.getItem("showDetails");
    if (
      this.show &&
      this.show._id &&
      this.show.country &&
      this.show.country._id
    ) {
      this.getShowByIDAndCountry(this.show._id, this.show.country._id);
    } else {
      this._utilitiesService.routeToDashboard();
    }
  }

  public getShowByIDAndCountry(showID, country): void {
    this._communicationService.showLoading(true);
    this._showDetailsService.getShowByIDAndCountry(showID, country).subscribe(
      (response) => {
        this.show.dates = response;
        this.show.authors = this.show.authors ? this.show.authors : [];
        this.show.actors = this.show.actors ? this.show.actors : [];
        this.show.authors = this.show.authors ? this.show.authors : [];
        if (Number.isInteger(this.show.duration)) {
          this.show.durationText = this._utilitiesService.convertMinutes(
            this.show.duration
          );
        }
      },
      (err) => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
        if (this.show.dates && this.show.dates.length > 0) {
          for (const date of this.show.dates) {
            if (date.timezone) {
              for (const time of date.plays) {
                if (time.timezone) {
                  time.timeDisplay = moment
                    .tz(time.time, time.timezone)
                    .locale("en")
                    .format("hh:mm A");
                }
              }
            }
          }
          // this.selectDate(0);
        }
        this.showComponentStep = 1;
      }
    );
  }

  //ROUTE TO STEP TWO
  public bookPlay() {
    this._router.navigateByUrl(this.routeVariables.showStepTwo);
    StorageService.setItem("times", this.times);
    StorageService.setItem("selectedTimeIndex", this.selectedTimeIndex);
  }

  //INITIALIZE STEP TWO
  public bookPlayInitialization() {
    if (
      this.show &&
      this.times &&
      this.times[this.selectedTimeIndex] &&
      this.times[this.selectedTimeIndex]._id
    ) {
      this.chosenPlay = this.times[this.selectedTimeIndex]._id;
      this.getZonesByPlay(this.chosenPlay);
    } else {
      this._utilitiesService.routeToDashboard();
    }
  }

  //ROUTE TO STEP THREE
  public showSeats() {
    this._router.navigateByUrl(this.routeVariables.showStepThree);
    if (
      StorageService.getItem("selectedZoneIndex") !== this.selectedZoneIndex
    ) {
      this.selectSeatsObj = null;
    }
    StorageService.setItem("selectedZoneIndex", this.selectedZoneIndex);
    StorageService.setItem("zonesResponse", this.zonesResponse);
    StorageService.setItem("chosenPlay", this.chosenPlay);
  }

  //INITIALIZE STEP THREE
  public ticketsInitialization() {
    if (this.show && this.zonesResponse && this.chosenPlay) {
      this.chosenZone = this.zonesResponse.zones[this.selectedZoneIndex]._id;
      this.getSeatingsByZone(this.chosenZone, this.chosenPlay);
    } else {
      this._utilitiesService.routeToDashboard();
    }
  }

  public getZonesByPlay(playID): void {
    this._communicationService.showLoading(true);
    this._showDetailsService.getZones(playID).subscribe(
      (response) => {
        this.zonesResponse = response;
      },
      (err) => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        window.scrollTo(0, 0);
        this.showComponentStep = 2;
        this._communicationService.showLoading(false);
      }
    );
  }

  public getSeatingsByZone(zoneID, playID): void {
    this._communicationService.showLoading(true);
    this._showDetailsService.getSeatingsByZone(zoneID, playID).subscribe(
      (response) => {
        this.seatingsResponse = response;
      },
      (err) => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        for (const row of this.seatingsResponse) {
          row.seat_price =
            this.zonesResponse.zones[this.selectedZoneIndex].price;
        }
        // this._initializeForm();
        window.scrollTo(0, 0);
        this.showComponentStep = 3;
        this._communicationService.showLoading(false);
      }
    );
  }

  public checkEmptySeatLeft(map) {
    // tslint:disable-line
    for (const row of map) {
      let index = 0;
      for (const seat of row.seats) {
        if (seat.status === "booked") {
          if (index === 0 || index === row.seats.length - 1) {
            if (
              (index === 0 &&
                row.seats[1] &&
                row.seats[1].status === "available") ||
              (index === row.seats.length - 1 &&
                row.seats[row.seats.length - 2] &&
                row.seats[row.seats.length - 2].status === "available")
            ) {
              if (
                (index === 0 &&
                  row.seats[2] &&
                  row.seats[2].status !== "available") ||
                (index === row.seats.length - 1 &&
                  row.seats[row.seats.length - 3] &&
                  row.seats[row.seats.length - 3].status !== "available")
              ) {
                return false;
              }
            }
          } else {
            if (
              (row.seats[index + 1] &&
                row.seats[index + 1].status === "available") ||
              (row.seats[index - 1] &&
                row.seats[index - 1].status === "available")
            ) {
              if (
                !row.seats[index + 2] ||
                (row.seats[index + 2] &&
                  row.seats[index + 2].status !== "available") ||
                !row.seats[index - 2] ||
                (row.seats[index - 2] &&
                  row.seats[index - 2].status !== "available")
              ) {
                return false;
              }
            }
          }
        }
        index++;
      }
    }
    return true;
  }

  public bookSeats(): void {
    if (this.disableLeaveOneSeatsEmpty) {
      if (this.checkEmptySeatLeft(this.seatmap)) {
        this.getPaymentMethods();
      } else {
        this.showAlert(this.translation.SEATS.EMPTY_SEATS_NOT_ALLOWED, "");
      }
    } else {
      this.getPaymentMethods();
    }
  }

  public getPaymentMethods() {
    const params = {
      play: this.chosenPlay,
      zone: this.chosenZone,
      seats: this.selectSeatsObj.seatstoStore,
    };
    this._communicationService.showLoading(true);
    this._showDetailsService.getPaymentMethod(params).subscribe(
      (response) => {
        this.bookSeatingsResponse = response;
      },
      (err) => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
        if (this.bookSeatingsResponse.fromWallet) {
          this._communicationService.notifyComponent(
            "app-top-bar",
            "changeWallet",
            { wallet: this.bookSeatingsResponse.wallet }
          );
          this._router.navigate(["/" + this.routeVariables.dashboard], {
            queryParams: {
              success: true,
              fromWallet: true,
              price: this.bookSeatingsResponse.price,
            },
          });
        } else {
          window.scroll(0, 0);
          this._router.navigateByUrl(this.routeVariables.showStepFour);
          StorageService.setItem(
            "bookSeatingsResponse",
            this.bookSeatingsResponse
          );
          StorageService.setItem("selectSeatsObj", this.selectSeatsObj);
          StorageService.setItem("chosenZone", this.chosenZone);
        }
      }
    );
  }

  public initilizePaymentPage() {
    this.chosenPlay = StorageService.getItem("chosenPlay");
    this.chosenZone = StorageService.getItem("chosenZone");
    this.selectSeatsObj = StorageService.getItem("selectSeatsObj");
    this.bookSeatingsResponse = StorageService.getItem("bookSeatingsResponse");
    if (
      this.chosenPlay &&
      this.chosenZone &&
      this.selectSeatsObj &&
      this.bookSeatingsResponse
    ) {
      this.showComponentStep = 4;
    } else {
      this._utilitiesService.routeToLanding();
    }
  }

  public applyPayment() {
    const params = {
      play: this.chosenPlay,
      zone: this.chosenZone,
      seats: this.selectSeatsObj.seatstoStore,
      paymentType: this.chosenPackage.PaymentMethodId.toString(),
    };
    this._communicationService.showLoading(true);
    this._showDetailsService.finishPayment(params).subscribe(
      (response) => {
        this.finishPayment = response;
      },
      (err) => {
        this._communicationService.showLoading(false);
        this._handleErrors(err);
      },
      () => {
        this._communicationService.showLoading(false);
        if (this.finishPayment && this.finishPayment.url) {
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.href = this.finishPayment.url;
          a.click();
          document.body.removeChild(a);
        } else {
          const errorMessage = this._translationService.instant(
            "GENERAL_ERRORS.INTERNAL_ERROR_TITLE"
          );
          this.showAlert(errorMessage, "");
        }
      }
    );
  }

  public showAlert(title: string, content: string): void {
    const dialogId = new Date();
    this._communicationService.setLatestDialogId(dialogId);
    this._dialog.open(DialogComponent, {
      data: {
        title,
        content,
        isConfirmationPopUp: false,
      },
    });
  }

  // private _initializeForm(): void {
  //   this.form = this._formBuilder.group({
  //     covidTerms: [false, Validators.required]
  //   }, {validator: [termsValidation]});
  // }

  private _handleErrors(error) {
    switch (error.status) {
      case 404:
        this.showAlert(error.data.message.data.message[this.currentLang], "");
        break;
      default:
        this.showAlert(
          this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TITLE,
          this.translation.GENERAL_ERRORS.INTERNAL_ERROR_TEXT
        );
        break;
    }
  }
}
