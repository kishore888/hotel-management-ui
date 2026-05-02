import { Employee } from './employee.model';

export class EmployeeShiftSchedule {
    constructor(
        public shiftScheduleId: number,
        public employee: Employee,
        public shiftDate: string,
        public shift: string,
        public shiftStartTime: string,
        public shiftEndTime: string,
        public notes: string,
        public createdOn: string,
        public createdBy: string,
        public updatedOn: string,
        public updatedBy: string
    ) {}
}
