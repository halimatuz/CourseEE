import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../services/general/general.service';
import { map } from 'rxjs/operators';
import { General } from '../services/general/general.model';
import { Specific } from '../services/specific/specific.model';
import { SpecificService } from '../services/specific/specific.service';
import { ProgramService } from 'app/services/program/program.service';
import { Program } from 'app/services/program/program.model';
import { StudentService } from 'app/services/student/student.service';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
    selector: 'app-components',
    templateUrl: './components.component.html',
    styles: [`
    ngb-progressbar {
        margin-top: 5rem;
    }
    `]
})

export class ComponentsComponent implements OnInit {
  general?: General[];
  currentIndex = 0;
  lenGen=0;
  ChoosedSpesific=[];

  dum=0;

  specific? : Specific[];
  displayedSpec : Specific[]=[];
  currSpecIdx = 0;
  lenSpec =0;
  point = [0,0,0,0,0,0,0,0,0,0,0];
  
  prog?: Program[];
  choosedProg : Program[]=[];

  test : Date = new Date();
    focus;
    focus1;
    obtainedData = false;

  submitted=false;
  idSession='';
  str: String='';

  formSiswa: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    school: new FormControl(''),
    grade: new FormControl(''),
    interest: new FormControl(''),
  });

    constructor(
        private generalService: GeneralService,
        private specService: SpecificService,
        private programService: ProgramService,
        private studService : StudentService,
        private formBuilder: FormBuilder
        ) {
            this.readGeneral();
            this.readSpec();
            this.readProg();
            
        }
 
    ngOnInit(): void {
      this.formSiswa = this.formBuilder.group(
        {
          name: ['', Validators.required],
          email : ['', [Validators.email,Validators.required]],
          phone : ['', Validators.required],
          school : ['', Validators.required],
          grade : ['', Validators.required],
          interest : [-1],
          created_at : new Date().toLocaleString(),
        }
      );
      }
      get f(): { [key: string]: AbstractControl } {
        return this.formSiswa.controls;
      }
      onSubmit(): void {
        this.submitted = true;
    
        if (this.formSiswa.invalid) {
          return;
        }else{
         this.studService.create(this.formSiswa.value).then(docRef => {
          this.idSession=docRef.id;
          this.obtainedData=true;
      })
      .catch(error => console.error("Error adding document: ", error)) 
        }
    
        console.log(JSON.stringify(this.formSiswa.value, null, 2));
      }

      readGeneral(): void {
        this.generalService.getAll().snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
          )
        ).subscribe(data => {
          this.general = data;
          this.lenGen=this.general.length;
        });

      }
      ChoseeNot(){
        this.currentIndex=this.currentIndex+1;
        this.nextSpec()

      }
      ChoseeYes(){
        for (let i = 0; i < this.general[this.currentIndex].nextq.length; i++) {
            if(!this.ChoosedSpesific.includes(this.general[this.currentIndex].nextq[i]))
            this.ChoosedSpesific.push(this.general[this.currentIndex].nextq[i])
        }
        this.currentIndex=this.currentIndex+1;
        this.nextSpec()
      }
      nextSpec(){

        if(this.currentIndex>=this.lenGen){
          this.lenSpec=this.ChoosedSpesific.length;
            for (let x of this.specific){
                if(this.ChoosedSpesific.includes(x.code))
                this.displayedSpec.push(x) 
            }
            console.log(this.ChoosedSpesific)
        }

      }
      readSpec(): void {
        this.specService.getAll().snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
          )
        ).subscribe(data => {
          this.specific = data;
          this.lenSpec = this.specific.length;
          
        });
      }

      ChoseeSpecNot(){
        this.currSpecIdx=this.currSpecIdx+1;
        this.showResult();

      }
      ChoseeSpecYes(x){
      this.point[x]=this.point[x]+10;
      this.currSpecIdx=this.currSpecIdx+1;
      this.showResult();
      }

      readProg(): void {
        this.programService.getAll().snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
          )
        ).subscribe(data => {
          this.prog = data;
          // this.choosedProg =data;
          // console.log(this.prog)
        });

      }

      showResult(){
        
        if(this.currSpecIdx>=this.lenSpec){
          console.log(this.point)
          let idxMax=0;
          let max = this.point[0];
          for (let index = 0; index < this.point.length; index++) {
            if(max < this.point[index]){
              max = this.point[index]
              idxMax=index;
            }
          }
          for( let j of this.prog){
            if(j.code==idxMax)
            this.choosedProg.push(j);
          }
          
          console.log(this.choosedProg);
          if(this.idSession){
            this.studService.update(this.idSession, { interest: this.choosedProg[0].code })
            .then(() => {
              console.log('The status was updated successfully!');
            })
            .catch(err => console.log(err));
          }
        }
      }

}
