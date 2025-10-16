import Availability from '../Models/Availability.mjs';

export const getDesignerAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({ designer_id: req.user.id })
      .sort({ available_date: 1 });
    res.json({ success: true, availability });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addAvailability = async (req, res) => {
  try {
    const { available_date, start_time, end_time } = req.body;
    const availability = new Availability({
      designer_id: req.user.id,
      available_date,
      start_time,
      end_time
    });
    await availability.save();
    res.status(201).json({ success: true, availability });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { status } = req.body;
    const availability = await Availability.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, availability });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};