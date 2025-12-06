import { ProfilesMiddleware } from './profiles.middleware';

describe('ProfilesMiddleware', () => {
  it('should be defined', () => {
    expect(new ProfilesMiddleware()).toBeDefined();
  });
});
