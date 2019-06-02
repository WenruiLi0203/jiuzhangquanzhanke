import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';
import { CourseService } from 'app/shared/service/CourseService';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    classNeedToReg: CourseDto = new class implements CourseDto {
        courseContent: string;
        courseLocation: string;
        courseName: string;
        courseTeacher: string;
    }();

    classNeedToMod: CourseDto = new class implements CourseDto {
        courseContent: string;
        courseLocation: string;
        courseName: string;
        courseTeacher: string;
    }();

    classNameNeedToDel: string;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private courseService: CourseService
    ) {}

    courses: CourseDto[] = [];

    coursesWithTN: CourseWithTNDto[] = [];

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getAllCourses() {
        this.courseService.getCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    getAllCoursesWithTN() {
        this.courseService.getCourseInfoWithTN().subscribe(curDto => {
            if (!curDto) {
                this.coursesWithTN = [];
            } else {
                this.coursesWithTN = curDto;
            }
        });
    }

    // registerCourse(courseName) {
    //
    // }

    clearAllCourses() {
        this.courses = [];
    }

    clearAllCoursesWithTN() {
        this.coursesWithTN = [];
    }

    registerNewClass() {
        this.courseService.addCourse(this.classNeedToReg).subscribe();
        this.classNeedToReg = new class implements CourseDto {
            courseContent: string;
            courseLocation: string;
            courseName: string;
            courseTeacher: string;
        }();
    }

    deleteClass(name) {
        // debugger;
        // this.courseService.delete(this.classNameNeedToDel);
        this.courseService.delete(name).subscribe();
    }

    modifyClass() {
        this.courseService.update(this.classNeedToMod).subscribe();
        this.classNeedToMod = new class implements CourseDto {
            courseContent: string;
            courseLocation: string;
            courseName: string;
            courseTeacher: string;
        }();
    }
}
