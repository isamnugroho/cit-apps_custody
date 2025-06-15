/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import Swiper from 'swiper';
import { register } from 'swiper/element';
declare var google: any;

register();
@Component({
  selector: 'app-salon-info',
  templateUrl: './salon-info.page.html',
  styleUrls: ['./salon-info.page.scss'],
})
export class SalonInfoPage implements OnInit {
  @ViewChild("swiper") swiper?: ElementRef<{ swiper: Swiper }>
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  name: any = '';
  address: any = '';
  rate: any = '';
  activeIndex: any = 0;
  slideOptStores = {
    initialSlide: 0,
    slidesPerView: 4.2,
  };
  activeContent: any = 'about';
  constructor(
    public util: UtilService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      const info = this.util.salonList[data.id];
      this.name = info.name;
      this.address = info.address;
      this.rate = info.rate;
    });
    setTimeout(() => {
      this.getULocation();
    }, 2000);
  }

  getULocation() {
    let map;
    var centerCords = {
      lat: 21.5346,
      lng: 71.8275
    };
    initMap();

    function initMap() {
      var style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -100 }
          ]
        }
      ];

      var mapOptions = {
        zoom: 10,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        center: centerCords,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'nepate']
        },
        disableDefaultUI: true
      }

      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
      map.mapTypes.set('nepate', mapType);
      map.setMapTypeId('nepate');
    }
  }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

  changed() {
    this.activeIndex = this.swiper?.nativeElement.swiper.activeIndex;
  }

  changeActiveContent(name: string) {
    this.activeContent = name;
  }

  onServiceList() {
    this.util.navigateToPage('services-list');
  }

  onServiceDetails(name: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name
      }
    };
    this.util.navigateToPage('service-details', param);
  }

  onSpecialist() {
    this.util.navigateToPage('specialist');
  }

  onPackagesList() {
    this.util.navigateToPage('packages-list');
  }

  onPackageInfo(name: any, image: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name,
        image: image
      }
    };
    this.util.navigateToPage('package-details', param);
  }

  onGallery() {
    this.util.navigateToPage('gallery-list');
  }

  onReviewsList() {
    this.util.navigateToPage('review-list');
  }

  onPayment() {
    this.util.navigateToPage('select-slot');
  }

}
