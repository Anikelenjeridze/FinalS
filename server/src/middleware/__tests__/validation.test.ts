import { Request, Response, NextFunction } from 'express';
import { validateEventData } from '../validation';




describe('validateEventData middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;




  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = { body: {} };
    mockRes = { status: mockStatus };
    mockNext = jest.fn();
  });

     it('should call next() with valid event data', () => {
    mockReq.body = {
      title: 'Valid Event',
      date: '2025-06-01',
      time: '10:00',
      location: 'Valid Location',
      description: 'Valid Description',
      category: 'Social',
      organizer: 'Valid Organizer'
    };

    validateEventData(mockReq as Request, mockRes as Response, mockNext);

       expect(mockNext).toHaveBeenCalledWith();
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it('should return 400 with missing title', () => {
    mockReq.body = {
      date: '2025-06-01',
      time: '10:00',
      location: 'Valid Location',
      description: 'Valid Description',
      category: 'Social',
      organizer: 'Valid Organizer'
    };



    validateEventData(mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining(['Title is required and must be a non-empty string'])
    });
  });

  it('should return 400 with invalid date format', () => {
    mockReq.body = {
      title: 'Valid Event',
      date: 'invalid-date',
      time: '10:00',
      location: 'Valid Location',
      description: 'Valid Description',
      category: 'Social',
      organizer: 'Valid Organizer'
    };




    validateEventData(mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining(['Date is required and must be in YYYY-MM-DD format'])
    });
  });

  it('should return 400 with invalid time format', () => {
    mockReq.body = {
      title: 'Valid Event',
      date: '2025-06-01',
      time: 'invalid-time',
      location: 'Valid Location',
      description: 'Valid Description',
      category: 'Social',
      organizer: 'Valid Organizer'
    };





    validateEventData(mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining(['Time is required and must be in HH:MM format'])
    });
  });



  it('should return 400 with invalid category', () => {
    mockReq.body = {
      title: 'Valid Event',
      date: '2025-06-01',
      time: '10:00',
      location: 'Valid Location',
      description: 'Valid Description',
      category: 'InvalidCategory',
      organizer: 'Valid Organizer'
    };

    validateEventData(mockReq as Request, mockRes as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining(['Category is required and must be one of: Social, Education, Sports, Arts, Other'])
    });
  });

 
 
  it('should return 400 with multiple validation errors', () => {
 
 
   mockReq.body = {
      title: '',
      date: 'invalid',
      time: 'invalid',
      location: '',
      description: '',
      category: 'Invalid',
      organizer: ''
    };

    validateEventData(mockReq as Request, mockRes as Response, mockNext);

   
   
   
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        'Title is required and must be a non-empty string',
        'Date is required and must be in YYYY-MM-DD format',
        'Time is required and must be in HH:MM format',
        'Location is required and must be a non-empty string',
        'Description is required and must be a non-empty string',
        'Category is required and must be one of: Social, Education, Sports, Arts, Other',
        'Organizer is required and must be a non-empty string'
      ])
    });
  });
});