import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AcademicInfoProps {
  formData: {
    year: string;
    course: string;
    academicLoadUnits: string;
    yearsOfParticipation: string;
    highSchoolGradYear: string;
    eventType: string;
    school: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string) => void;
}

const AcademicInfoSection = ({ formData, handleInputChange, handleSelectChange }: AcademicInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Academic Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year" className="text-white font-medium mb-2 block">Year Level</Label>
          <Input
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
        <div>
          <Label htmlFor="course" className="text-white font-medium mb-2 block">Course</Label>
          <Input
            id="course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="academicLoadUnits" className="text-white font-medium mb-2 block">Academic Load Units</Label>
        <Input
          id="academicLoadUnits"
          name="academicLoadUnits"
          type="number"
          value={formData.academicLoadUnits}
          onChange={handleInputChange}
          className="bg-white/10 text-white border-white/20"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="yearsOfParticipation" className="text-white font-medium mb-2 block">Years of Participation</Label>
          <Input
            id="yearsOfParticipation"
            name="yearsOfParticipation"
            type="number"
            value={formData.yearsOfParticipation}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
        <div>
          <Label htmlFor="highSchoolGradYear" className="text-white font-medium mb-2 block">High School Graduation Year</Label>
          <Input
            id="highSchoolGradYear"
            name="highSchoolGradYear"
            type="number"
            value={formData.highSchoolGradYear}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="eventType" className="text-white font-medium mb-2 block">Event Type</Label>
          <Select value={formData.eventType} onValueChange={handleSelectChange}>
            <SelectTrigger className="bg-white/10 text-white border-white/20">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="socio-cultural">Socio-cultural</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="school" className="text-white font-medium mb-2 block">School</Label>
          <Input
            id="school"
            name="school"
            value={formData.school}
            onChange={handleInputChange}
            className="bg-white/10 text-white border-white/20"
            placeholder="Enter your school name"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoSection;