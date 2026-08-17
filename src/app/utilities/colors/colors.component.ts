import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  type = 0;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    // 1
    this.type = +this.route.snapshot.paramMap.get('type');

    // 2
    this.route.paramMap.subscribe(params => {
      this.type = +params.get('type');
    });

    // 3
    // this.type = this.route.snapshot.params['type'];

    // 4
    // this.route.params.subscribe(params => {
    //   this.type = params.get('type');
    // });

    this.readData();
  }

  readData(): void {
    const seo = this.route.snapshot.data.seo as SeoData | undefined;
    if (seo) {
      console.log(seo.title);
    }
  }

  plusOne() {
    // this.router.navigate(['/utilities/color/', this.type+1])
    // this.router.navigate(['../', this.type+1], { relativeTo: this.route })
    this.router.navigate(['/utilities/color/', this.type+1], {
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1
      }
    });
  }

}

interface SeoData {
  title: string;
  desc: string;
}
